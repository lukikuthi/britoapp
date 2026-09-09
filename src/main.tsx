import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { syncPendingActions } from "./lib/offline-db";
import "./styles.css";

import { toast } from "sonner";

window.onerror = (message, source, lineno, colno, error) => {
  document.body.innerHTML = `<div style="padding: 20px; font-family: monospace; color: red;"><h1>App Crashed!</h1><p><b>Message:</b> ${message}</p><pre>${error?.stack}</pre></div>`;
};

window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `<div style="padding: 20px; font-family: monospace; color: red;"><h1>Unhandled Promise Rejection!</h1><p><b>Reason:</b> ${event.reason}</p><pre>${event.reason?.stack}</pre></div>`;
});

// Sincronização offline automática quando a internet volta
window.addEventListener('online', async () => {
  console.log("Internet restored. Attempting to sync offline data...");
  const syncToastId = toast.loading("Conexão restaurada. Sincronizando dados pendentes (RDO, Fotos, etc)...");
  try {
    const synced = await syncPendingActions();
    if (synced) {
      console.log("Offline data synced successfully!");
      toast.success("Sincronização offline concluída com sucesso!", { id: syncToastId });
    } else {
      toast.dismiss(syncToastId);
    }
  } catch (err: any) {
    console.error("Failed to sync offline data:", err);
    toast.error(`Falha ao sincronizar dados offline: ${err.message}`, { id: syncToastId, duration: 8000 });
  }
});

const router = getRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
