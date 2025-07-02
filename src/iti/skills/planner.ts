import { parse } from "chrono-node";
import {
  addDays,
  format,
  setHours,
  setMinutes,
  isValid,
} from "date-fns";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

const defaultSlots = [
  { hour: 9, minutes: 0 },
  { hour: 11, minutes: 0 },
  { hour: 14, minutes: 0 },
  { hour: 16, minutes: 0 },
];

// Helper to parse time from raw string
function extractTime(raw: string) {
  const timeMatch = raw.match(/at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);

  if (!timeMatch) return null;

  let hour = parseInt(timeMatch[1]);
  const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
  const meridian = timeMatch[3]?.toLowerCase();

  if (meridian === "pm" && hour < 12) hour += 12;
  if (meridian === "am" && hour === 12) hour = 0;

  return { hour, minutes };
}

function cleanTitle(raw: string) {
  return raw
    .replace(/at\s+\d{1,2}(?::\d{2})?\s*(am|pm)?/gi, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

function addMinutes(date: Date, mins: number): Date {
  return new Date(date.getTime() + mins * 60000);
}

export function parseTasksToEvents(
  rawTasks: string[],
  fallbackStart: Date = new Date()  // <--- Changed from startOfWeek to now
): Event[] {
  const events: Event[] = [];
  const usedSlots: Record<string, Set<string>> = {};

  rawTasks.forEach((raw, i) => {
    const chronoResult = parse(raw)[0];
    let taskDate = chronoResult?.start?.date();

    // Fallback: distribute starting *from today*
    if (!isValid(taskDate)) {
      taskDate = addDays(fallbackStart, i);  // push i days forward from now
    }

    const dateKey = format(taskDate, "yyyy-MM-dd");
    if (!usedSlots[dateKey]) usedSlots[dateKey] = new Set();
    const usedTimeSet = usedSlots[dateKey];

    const cleaned = cleanTitle(raw);
    const time = extractTime(raw);

    let start: Date;
    let end: Date;

    if (time) {
      start = setMinutes(setHours(taskDate, time.hour), time.minutes);
    } else {
      const fallback = defaultSlots.find(
        (s) => !usedTimeSet.has(`${s.hour}:${s.minutes}`)
      ) || defaultSlots[0];
      usedTimeSet.add(`${fallback.hour}:${fallback.minutes}`);
      start = setMinutes(setHours(taskDate, fallback.hour), fallback.minutes);
    }

    end = addMinutes(start, 60); // Default 1-hour duration

    events.push({
      id: Math.random().toString(36).substr(2, 9),
      title: cleaned,
      start,
      end,
    });
  });

  return events;
}