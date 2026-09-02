import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

window.onerror = (message, source, lineno, colno, error) => {
  document.body.innerHTML = `<div style="padding: 20px; font-family: monospace; color: red;"><h1>App Crashed!</h1><p><b>Message:</b> ${message}</p><pre>${error?.stack}</pre></div>`;
};

window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = `<div style="padding: 20px; font-family: monospace; color: red;"><h1>Unhandled Promise Rejection!</h1><p><b>Reason:</b> ${event.reason}</p><pre>${event.reason?.stack}</pre></div>`;
});

const router = getRouter();

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
