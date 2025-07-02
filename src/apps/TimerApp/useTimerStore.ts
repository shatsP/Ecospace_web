// src/apps/TimerApp/useTimerStore.ts (unchanged)
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Reminder {
  id: string;
  text: string;
  time: string; // ISO timestamp
}

interface TimerState {
  reminders: Reminder[];
  hasReminders: boolean;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
  clearReminders: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      reminders: [],
      hasReminders: false,
      addReminder: (reminder: Reminder) => {
        set({ reminders: [...get().reminders, reminder], hasReminders: true });
      },
      removeReminder: (id: string) => {
        const newReminders = get().reminders.filter((r) => r.id !== id);
        set({ reminders: newReminders, hasReminders: newReminders.length > 0 });
      },
      clearReminders: () => {
        console.log("useTimerStore: Clearing reminders");
        set({ reminders: [], hasReminders: false });
      },
    }),
    {
      name: "ecospace_reminders",
      onRehydrateStorage: () => (state) => {
        try {
          if (state) {
            state.hasReminders = state.reminders.length > 0;
          }
        } catch (error) {
          console.error("useTimerStore: Hydration error:", error);
        }
      },
    }
  )
);