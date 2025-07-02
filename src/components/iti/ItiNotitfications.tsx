import { useNotificationStore } from "../../core/notificationStore";
import { AnimatePresence, motion } from "framer-motion";

export default function ItiNotifications() {
  const notifications = useNotificationStore((s) => s.notifications);
  const removeNotification = useNotificationStore((s) => s.removeNotification);

  return (
    <div className="fixed bottom-24 right-10 z-50 space-y-4 max-w-xs">
      <AnimatePresence>
        {notifications.map(({ id, message, type = "info" }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="relative"
          >
            <div
              className={`p-3 pr-4 rounded-lg shadow-md text-white text-sm ${
                {
                  info: "bg-zinc-800",
                  success: "bg-green-600",
                  warning: "bg-yellow-600",
                  error: "bg-red-600",
                }[type]
              }`}
            >
              {message}
            </div>

            <button
              onClick={() => removeNotification(id)}
              className="absolute -top-2 -right-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
