import { useEffect, useState } from "react";
import { WifiOff, Loader2 } from "lucide-react";
import { syncPendingApontamentos } from "@/lib/apontamentos-offline";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function useOnlineStatus() {
  const [online, setOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (isOnline) {
      // Quando volta online, tentar sincronizar os apontamentos salvos no IndexedDB
      setIsSyncing(true);
      syncPendingApontamentos()
        .then((didSync) => {
          if (didSync) {
            toast.success("Dados sincronizados com o servidor!");
            // Invalida os apontamentos e rdos para recarregar com as alterações sincronizadas
            qc.invalidateQueries({ queryKey: ["apontamentos"] });
            qc.invalidateQueries({ queryKey: ["apontamento-counts"] });
          }
        })
        .catch((e) => {
          console.error("Erro no sync automático", e);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, [isOnline, qc]);

  if (isOnline) {
    if (isSyncing) {
      return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg bg-[var(--brand-gold)] text-black">
          <Loader2 className="size-4 animate-spin" />
          <span>Sincronizando...</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg bg-destructive text-destructive-foreground">
      <WifiOff className="size-4" />
      <span>Modo offline (Salvando no dispositivo)</span>
    </div>
  );
}
