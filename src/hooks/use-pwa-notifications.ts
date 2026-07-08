import { useEffect, useState, useCallback } from "react";

export function usePwaNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === "granted";
  }, []);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission === "granted" && typeof Notification !== "undefined") {
        new Notification(title, {
          icon: "/icon-192.png",
          badge: "/icon-192.png",
          ...options,
        });
      }
    },
    [permission]
  );

  return { permission, requestPermission, sendNotification };
}
