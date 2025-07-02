import type { DetectedIntent } from "./types";

// Extract comma-separated tasks for planner intent
const extractTasksFromInput = (input: string): string[] => {
  const raw = input
    .replace(/plan my week|schedule my week|please|iti|can you/gi, "")
    .replace(/with|for|and then/gi, ",")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  return raw;
};

// Simple entity extraction for launch intents
const extractEntities = (input: string): Record<string, string> => {
  const entities: Record<string, string> = {};

  // Food-related
  const foodMatch = input.match(/order (.+?)(?: from| on| at|$)/i);
  if (foodMatch) entities.food = foodMatch[1];

  // Location-related
  const locationMatch = input.match(/to (the )?(.*?)( at| by| around|$)/i);
  if (locationMatch) entities.destination = locationMatch[2];

  // Time-related
  const timeMatch = input.match(/at (\d{1,2}(?::\d{2})?\s?(?:am|pm)?)/i);
  if (timeMatch) entities.time = timeMatch[1];

  return entities;
};

export const detectIntent = (input: string): DetectedIntent => {
  const lower = input.toLowerCase();
  const entities = extractEntities(input);

  // 🌐 SmartLauncher rules
  if (lower.includes("order food") || lower.includes("swiggy") || lower.includes("zomato") || lower.includes("order")) {
    return { intent: "launch_order_food", entities };
  }

if (
    lower.includes("book a cab") ||  // ✅ add this
    lower.includes("book cab") || 
    lower.includes("taxi") || 
    lower.includes("uber") || 
    lower.includes("ola")
  ) {
    return { intent: "launch_book_taxi", entities: extractEntities(lower) };
  }


  if (lower.includes("map") || lower.includes("direction") || lower.includes("location")) {
    return { intent: "launch_maps", entities };
  }

  if (lower.includes("email") || lower.includes("gmail") || lower.includes("check mail")) {
    return { intent: "launch_email" };
  }

  if (lower.includes("plan my week") || lower.includes("schedule my week")) {
    const tasks = extractTasksFromInput(lower);
    return { intent: "generate_week_plan", entities: tasks };
  }

  if (lower.includes("note") || lower.includes("write this down")) {
    return { intent: "open_notes" };
  }

  if (lower.includes("timer") || lower.includes("remind me in") || lower.includes("remind")) {
    return { intent: "open_timer" };
  }

  if (lower.includes("planner") || lower.includes("schedule") || lower.includes("plan")) {
    return { intent: "open_planner" };
  }

  if (lower.includes("continue") || lower.includes("expand")) {
    return { intent: "thought_writer" };
  }

  return { intent: "unknown" };
};
