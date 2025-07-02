import React, { useState, useMemo, useEffect } from "react";
import {
  format,
  startOfWeek,
  startOfMonth,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { parseTasksToEvents } from "../../iti/skills/planner";
import { useAppStore } from "../../core/StateStore";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface PlannerAppProps {
  triggerAddEvent?: boolean;
  onAddEventHandled?: () => void;
}

const STORAGE_KEY = "planner_events";

const hours = Array.from({ length: 24 }, (_, i) => i);
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PlannerApp: React.FC<PlannerAppProps> = () => {
  const rawTasks = useAppStore((s) => s.plannerRawTasks);
  const triggerAddEvent = useAppStore((s) => s.triggerAddEvent);
  const setTriggerAddEvent = useAppStore((s) => s.setTriggerAddEvent);

  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    date: format(currentDate, "yyyy-MM-dd"),
  });

  // Load stored events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((e: any) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));
        setEvents(restored);
      } catch (e) {
        console.error("Failed to load planner events from storage.", e);
      }
    }
  }, []);

  // Add generated tasks from Iti
  useEffect(() => {
    if (rawTasks && rawTasks.length > 0) {
      const generatedEvents = parseTasksToEvents(rawTasks, new Date());
      setEvents((prev) => {
        const merged = [...prev, ...generatedEvents];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      });
    }
  }, [rawTasks]);

  // Show Add Event Modal
  useEffect(() => {
    if (triggerAddEvent) {
      setShowAddEvent(true);
      setTriggerAddEvent(false);
    }
  }, [triggerAddEvent]);

  const navigate = (direction: "prev" | "next") => {
    if (view === "day") {
      setCurrentDate(direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1));
    } else if (view === "week") {
      setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end && newEvent.date) {
      const startDate = new Date(`${newEvent.date}T${newEvent.start}`);
      const endDate = new Date(`${newEvent.date}T${newEvent.end}`);
      if (endDate > startDate) {
        const nextEvents = [
          ...events,
          {
            id: Math.random().toString(36).substr(2, 9),
            title: newEvent.title,
            start: startDate,
            end: endDate,
          },
        ];
        setEvents(nextEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
        setShowAddEvent(false);
        setNewEvent({ title: "", start: "", end: "", date: format(currentDate, "yyyy-MM-dd") });
      } else {
        alert("End time must be after start time.");
      }
    }
  };

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const startDay = start.getDay() || 7;
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const days = [];
    for (let i = 1 - (startDay - 1); i <= daysInMonth; i++) {
      days.push(i > 0 ? new Date(currentDate.getFullYear(), currentDate.getMonth(), i) : null);
    }
    return days;
  }, [currentDate]);

  const renderDayView = () => (
    <div className="min-w-[400px] border border-zinc-700 rounded-lg">
      <div className="grid grid-cols-[80px_1fr] sticky top-0 z-10 bg-zinc-900">
        <div className="bg-zinc-800 border-b border-r border-zinc-700 p-2 text-xs font-bold text-center">Time</div>
        <div className="bg-zinc-800 border-b border-zinc-700 p-2 text-xs font-bold text-center">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </div>
      </div>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-[80px_1fr]">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-r border-zinc-700 p-2 text-xs text-right pr-4">{hour.toString().padStart(2, "0")}:00</div>
              <div className="border border-zinc-700 h-16 relative">
                {events
                  .filter((event) => isSameDay(event.start, currentDate))
                  .map((event) => {
                    const startHour = event.start.getHours();
                    const startMin = event.start.getMinutes();
                    const endHour = event.end.getHours();
                    const endMin = event.end.getMinutes();
                    if (startHour >= hour && startHour < hour + 1) {
                      const top = (startMin / 60) * 64;
                      const height = (endHour - startHour) * 64 + ((endMin - startMin) / 60) * 64;
                      return (
                        <div
                          key={event.id}
                          className="absolute left-1 right-1 bg-indigo-600 rounded text-xs p-1"
                          style={{ top, height }}
                        >
                          {event.title} ({format(event.start, "HH:mm")} - {format(event.end, "HH:mm")})
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div id="planner-week-view" className="min-w-[800px] border border-zinc-700 rounded-lg">
      <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10 bg-zinc-900">
        <div className="bg-zinc-800 border-b border-r border-zinc-700 p-2 text-xs font-bold text-center">Time</div>
        {weekDays.map((day, i) => (
          <div key={i} className="bg-zinc-800 border-b border-zinc-700 p-2 text-xs font-bold text-center">
            {format(day, "EEE, MMM d")}
          </div>
        ))}
      </div>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="grid grid-cols-[80px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className="border-r border-zinc-700 p-2 text-xs text-right pr-4">{hour.toString().padStart(2, "0")}:00</div>
              {weekDays.map((day, i) => (
                <div key={`${i}-${hour}`} className="border border-zinc-700 h-16 relative">
                  {events
                    .filter((event) => isSameDay(event.start, day))
                    .map((event) => {
                      const startHour = event.start.getHours();
                      const startMin = event.start.getMinutes();
                      const endHour = event.end.getHours();
                      const endMin = event.end.getMinutes();
                      if (startHour >= hour && startHour < hour + 1) {
                        const top = (startMin / 60) * 64;
                        const height = (endHour - startHour) * 64 + ((endMin - startMin) / 60) * 64;
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 bg-indigo-600 rounded text-xs p-1"
                            style={{ top, height }}
                          >
                            {event.title} ({format(event.start, "HH:mm")} - {format(event.end, "HH:mm")})
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="grid grid-cols-7 min-w-[800px] border border-zinc-700 rounded-lg">
      {daysOfWeek.map((day, i) => (
        <div key={i} className="bg-zinc-800 border-b border-zinc-700 p-2 text-xs font-bold text-center">{day}</div>
      ))}
      {monthDays.map((day, i) => (
        <div
          key={i}
          className={`border border-zinc-700 h-24 p-1 ${
            day && isSameMonth(day, currentDate) ? "bg-zinc-900" : "bg-zinc-950"
          }`}
        >
          {day && (
            <div className="text-xs">
              <div className="font-bold">{format(day, "d")}</div>
              {events
                .filter((event) => isSameDay(event.start, day))
                .map((event) => (
                  <div key={event.id} className="bg-indigo-600 rounded text-xs mt-1 p-1 truncate">
                    {event.title}
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full overflow-auto p-4 bg-zinc-900 text-white">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button onClick={() => navigate("prev")} className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded">←</button>
          <button onClick={() => navigate("next")} className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 rounded">→</button>
          <span className="text-sm font-bold">
            {view === "day" && format(currentDate, "MMMM d, yyyy")}
            {view === "week" && `${format(weekDays[0], "MMM d")} - ${format(weekDays[6], "MMM d, yyyy")}`}
            {view === "month" && format(currentDate, "MMMM yyyy")}
          </span>
        </div>
        <div className="flex space-x-2">
          {["day", "week", "month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as "day" | "week" | "month")}
              className={`px-3 py-1 rounded ${view === v ? "bg-indigo-600" : "bg-zinc-800 hover:bg-zinc-700"}`}
            >
              {v[0].toUpperCase() + v.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setShowAddEvent(true)}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded"
          >
            + Event
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-4 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Add Event</h2>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-2 bg-zinc-700 rounded text-white"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full p-2 bg-zinc-700 rounded text-white"
              />
              <input
                type="time"
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                className="w-full p-2 bg-zinc-700 rounded text-white"
              />
              <input
                type="time"
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                className="w-full p-2 bg-zinc-700 rounded text-white"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowAddEvent(false)} className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded">Cancel</button>
              <button onClick={handleAddEvent} className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === "day" && renderDayView()}
      {view === "week" && renderWeekView()}
      {view === "month" && renderMonthView()}
    </div>
  );
};

export default PlannerApp;