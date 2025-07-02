// src/core/notificationStore.ts
import { create } from "zustand";

export interface Notification {
  id: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number; // in ms
  action?: () => void;
}


interface NotificationState {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (n) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { ...n, id }],
    }));
    if (n.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((noti) => noti.id !== id),
        }));
      }, n.duration || 3000);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export const addNotification = (
  message: string,
  type?: "info" | "success" | "warning" | "error",
  duration?: number
) => {
  useNotificationStore.getState().addNotification({ message, type, duration });
};
