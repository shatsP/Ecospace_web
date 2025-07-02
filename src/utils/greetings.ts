// src/utils/greetings.ts

import { getUserMeta } from "../core/userMetaStore";
import { differenceInDays, parseISO } from "date-fns";

export function getContextualGreeting(): string {
  const meta = getUserMeta();
  const now = new Date();
  const hour = now.getHours();

  // 1. Time-based greeting
  const timeEmoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";
  const name = meta.name || "there";

  if (hour < 12) return `Good morning, ${name}. ${timeEmoji}`;
  if (hour < 18) return `Good afternoon, ${name}. ${timeEmoji}`;
  if (hour >= 18) return `Good evening, ${name}. ${timeEmoji}`;

  // 2. Recent file drop
  if (meta.lastDroppedFile) {
    const file = meta.lastDroppedFile;
    const droppedTime = parseISO(file.time);
    const isRecent = differenceInDays(now, droppedTime) === 0;

    if (isRecent && file.type.startsWith("audio")) {
      return `You left off at ${file.name} 🎧`;
    }

    if (isRecent) {
      return `Ready to finish ‘${file.name}’? 📄`;
    }
  }

  // 3. Birthday soon
  if (meta.dob) {
    const birthDate = parseISO(meta.dob);
    const thisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    const daysToBday = differenceInDays(thisYear, now);

    if (daysToBday > 0 && daysToBday <= 7) {
      return `${daysToBday} day${daysToBday > 1 ? "s" : ""} to your birthday, should I plan something? 🎂`;
    }
  }

  // 4. Default fallback
  return `Hello, ${name}!`;
}
