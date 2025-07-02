import { useEffect, useRef } from "react";
import { useTimerStore } from "../apps/TimerApp/useTimerStore";
import { useNotificationStore } from "./notificationStore";

const ReminderCheckerInner = () => {
  const reminders = useTimerStore((s) => s.reminders);
  const removeReminder = useTimerStore((s) => s.removeReminder);
  const hasReminders = useTimerStore((s) => s.hasReminders);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hasReminders) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const now = new Date();
      const dueReminders = reminders.filter((r) => {
        const reminderDate = new Date(r.time);
        return reminderDate <= now;
      });

      const notify = useNotificationStore.getState().addNotification;
      if (dueReminders.length > 0) {
        dueReminders.forEach((r) => {
          try {
            notify({
              message: `🔔 Reminder: ${r.text}`,
              type: "info",
              duration: 0,
            });
            removeReminder(r.id);
          } catch (error) {}
        });
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [reminders, removeReminder, hasReminders]);

  return null;
};

export const ReminderChecker = () => {
  const hasReminders = useTimerStore((s) => s.hasReminders);
  if (!hasReminders) {
    return null;
  }
  return <ReminderCheckerInner />;
};