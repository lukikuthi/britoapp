import { openDB, DBSchema, IDBPDatabase } from "idb";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

interface PendingApontamento {
  id: string;
  obraId: string;
  andarId: string;
  table: string;
  operation: "create" | "update" | "delete";
  payload: Record<string, unknown>;
  synced: boolean;
  timestamp: number;
}

interface ApontamentosOfflineDB extends DBSchema {
  pendingApontamentos: {
    key: string;
    value: PendingApontamento;
    indexes: { "by-obra": string; "by-synced": number };
  };
}

// ---------------------------------------------------------------------------
// DB singleton
// ---------------------------------------------------------------------------

const DB_NAME = "brito-apontamentos-offline";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ApontamentosOfflineDB>> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<ApontamentosOfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore("pendingApontamentos", {
          keyPath: "id",
        });
        store.createIndex("by-obra", "obraId");
        store.createIndex("by-synced", "synced");
      },
    });
  }
  return dbPromise;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function savePendingApontamento(
  obraId: string,
  andarId: string,
  table: string,
  operation: "create" | "update" | "delete",
  payload: Record<string, unknown>,
): Promise<void> {
  const db = await getDb();
  await db.put("pendingApontamentos", {
    id: `${table}:${andarId}:${Date.now()}`,
    obraId,
    andarId,
    table,
    operation,
    payload,
    synced: false,
    timestamp: Date.now(),
  });
}

export async function getPendingApontamentos(): Promise<PendingApontamento[]> {
  const db = await getDb();
  // IDB stores booleans, but the index was created on "synced".
  // `false` is stored as boolean; IDB compares with 0 for number indexes.
  // We get all and filter to be safe across environments.
  const all = await db.getAll("pendingApontamentos");
  return all.filter((item) => !item.synced);
}

export async function getPendingApontamentoCount(): Promise<number> {
  const items = await getPendingApontamentos();
  return items.length;
}

export async function markApontamentoSynced(id: string): Promise<void> {
  const db = await getDb();
  const item = await db.get("pendingApontamentos", id);
  if (item) {
    item.synced = true;
    await db.put("pendingApontamentos", item);
  }
}

export async function removeSyncedApontamentos(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction("pendingApontamentos", "readwrite");
  const store = tx.objectStore("pendingApontamentos");
  const items = await store.getAll();
  for (const item of items) {
    if (item.synced) {
      await store.delete(item.id);
    }
  }
  await tx.done;
}

export async function clearPendingApontamentos(): Promise<void> {
  const db = await getDb();
  await db.clear("pendingApontamentos");
}
