// src/apps/TimerApp.tsx
import React, { useState, useEffect } from "react";
import { useNotificationStore } from "../../core/notificationStore";
import { useTimerStore } from "./useTimerStore"; // Local import

const cities = [
  { name: "New York", offset: -4 },
  { name: "London", offset: 1 },
  { name: "Tokyo", offset: 9 },
  { name: "Sydney", offset: 10 },
  { name: "Mumbai", offset: 5.5 },
];

const TimerApp: React.FC = () => {
  const [localTime, setLocalTime] = useState(new Date());
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState("");

  const reminders = useTimerStore((s) => s.reminders);
  const addReminder = useTimerStore((s) => s.addReminder);
  const removeReminder = useTimerStore((s) => s.removeReminder);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date());

      const now = new Date();
      const dueReminders = reminders.filter((r) => new Date(r.time) <= now);
      const notify = useNotificationStore.getState().addNotification;

      if (dueReminders.length > 0) {
        dueReminders.forEach((r) => {
          notify({
            message: `🔔 Reminder: ${r.text}`,
            type: "info",
            duration: 0,
          });
          removeReminder(r.id);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [reminders, removeReminder]);

  const getCityTime = (offset: number) => {
    const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * offset);
  };

  const handleAddReminder = () => {
    if (!reminderTime) return;
    const newReminder = {
      id: Date.now().toString(),
      text: reminderText,
      time: reminderTime,
    };
    addReminder(newReminder);
    setReminderText("");
    setReminderTime("");
  };

  const upcomingReminders = reminders.filter((r) => {
    const now = new Date();
    const reminderDate = new Date(r.time);
    return reminderDate > now;
  });

  return (
    <div className="w-full h-full p-4 bg-zinc-900 text-white overflow-auto">
      <h2 className="text-lg font-bold mb-4">🕒 Timer & Reminders</h2>

      {/* Local Time */}
      <div className="mb-6">
        <h3 className="text-md font-semibold">Your Local Time</h3>
        <p className="text-2xl mt-1">{localTime.toLocaleTimeString()}</p>
      </div>

      {/* World Clock */}
      <div className="mb-6">
        <h3 className="text-md font-semibold">World Clock</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {cities.map((city) => (
            <div
              key={city.name}
              className="p-3 bg-zinc-800 rounded-2xl flex flex-col items-start"
            >
              <span className="font-bold">{city.name}</span>
              <span className="text-lg">
                {getCityTime(city.offset).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div>
        <h3 className="text-md font-semibold mb-2">Reminders</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            placeholder="Reminder text"
            value={reminderText}
            onChange={(e) => setReminderText(e.target.value)}
            className="p-2 rounded-2xl bg-zinc-800 text-white flex-1"
          />
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="p-2 rounded-2xl bg-zinc-800 text-white"
          />
          <button
            onClick={handleAddReminder}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-2xl"
          >
            ➕ Add
          </button>
        </div>

        <ul className="space-y-2">
          {upcomingReminders.length === 0 && (
            <li className="text-sm text-zinc-400">No upcoming reminders</li>
          )}
          {upcomingReminders.map((reminder) => (
            <li
              key={reminder.id}
              className="p-2 bg-zinc-800 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{reminder.text}</div>
                <div className="text-xs text-zinc-400">
                  {new Date(reminder.time).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => removeReminder(reminder.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimerApp;
