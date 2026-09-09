import { openDB, DBSchema, IDBPDatabase } from "idb";

// ---------------------------------------------------------------------------
// Schema Generic Offline
// ---------------------------------------------------------------------------

interface PendingAction {
  id: string; // unique offline id
  module: string; // "apontamentos", "rdo", etc.
  table: string; // table to sync
  operation: "create" | "update" | "delete";
  payload: Record<string, unknown>;
  synced: boolean;
  timestamp: number;
}

interface BritoOfflineDB extends DBSchema {
  pendingActions: {
    key: string;
    value: PendingAction;
    indexes: { "by-module": string; "by-synced": number };
  };
}

const DB_NAME = "brito-offline-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BritoOfflineDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<BritoOfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("pendingActions", {
          keyPath: "id",
        });
        store.createIndex("by-module", "module");
        store.createIndex("by-synced", "synced");
      },
    });
  }
  return dbPromise;
}

export async function savePendingAction(
  module: string,
  table: string,
  operation: "create" | "update" | "delete",
  payload: Record<string, unknown>,
): Promise<void> {
  const db = await getDb();
  await db.put("pendingActions", {
    id: `${table}:${Date.now()}:${Math.random().toString(36).substring(2, 9)}`,
    module,
    table,
    operation,
    payload,
    synced: false,
    timestamp: Date.now(),
  });
}

export async function getPendingActions(): Promise<PendingAction[]> {
  const db = await getDb();
  const all = await db.getAll("pendingActions");
  return all.filter((item) => !item.synced);
}

export async function markActionSynced(id: string): Promise<void> {
  const db = await getDb();
  const item = await db.get("pendingActions", id);
  if (item) {
    item.synced = true;
    await db.put("pendingActions", item);
  }
}

export async function syncPendingActions(): Promise<boolean> {
  const items = await getPendingActions();
  if (items.length === 0) return false;

  const { supabase } = await import("@/integrations/supabase/client");
  
  let didSyncAnything = false;

  for (const item of items) {
    try {
      // Decode and upload Base64 images if present
      if (item.operation === "create" && item.payload.storage_path && typeof item.payload.storage_path === 'string' && item.payload.storage_path.startsWith("offline_base64:")) {
        const parts = item.payload.storage_path.split("::");
        if (parts.length === 2) {
          const fileName = parts[0].replace("offline_base64:", "");
          const base64Data = parts[1];
          const response = await fetch(base64Data);
          const blob = await response.blob();
          
          await supabase.storage.from("rdo-midias").upload(fileName, blob, { contentType: "image/jpeg" });
          item.payload.storage_path = fileName; // replace payload with actual path
        }
      }

      if (item.operation === "create") {
        await supabase.from(item.table).insert(item.payload);
      } else if (item.operation === "update") {
        await supabase.from(item.table).update(item.payload).eq("id", item.payload.id);
      } else if (item.operation === "delete") {
        await supabase.from(item.table).delete().eq("id", item.payload.id);
      }
      await markActionSynced(item.id);
      didSyncAnything = true;
    } catch (e) {
      console.error(`Erro ao sincronizar item offline ${item.id}`, e);
    }
  }

  if (didSyncAnything) {
    const db = await getDb();
    const tx = db.transaction("pendingActions", "readwrite");
    const store = tx.objectStore("pendingActions");
    const all = await store.getAll();
    for (const i of all) {
      if (i.synced) await store.delete(i.id);
    }
    await tx.done;
  }

  return didSyncAnything;
}
