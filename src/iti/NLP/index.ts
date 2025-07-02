// src/iti/NLP/index.ts
import { cleanInput } from "./utils";
import { detectIntent } from "./intentRules";
import { extractDate, extractEntities } from "./utils";

export type ParsedInput = {
  intent: string;
  app: "notes" | "timer" | "planner" | null;
  date?: string | null;
  entities?: Record<string, any>;
  raw: string; // ✅ Include raw user input
};

export const parseInput = (input: string): ParsedInput => {
  const cleanedText = cleanInput(input);
  const { intent } = detectIntent(cleanedText);
  const date = extractDate(cleanedText);
  const entities = extractEntities(cleanedText);

  let app: ParsedInput["app"] = null;
  if (intent === "open_notes") app = "notes";
  else if (intent === "open_timer") app = "timer";
  else if (intent === "open_planner") app = "planner";

  return {
    intent,
    app,
    date,
    entities,
    raw: input, // ✅ Add the original input here
  };
};
