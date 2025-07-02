// Remove greetings, filler, unnecessary words
const fillerPhrases = [
  "hey iti", "hello", "hi", "can you", "could you", "would you", "please",
  "i want to", "i'd like to", "can i", "tell me", "help me", "thanks", "thank you",
];

export const cleanInput = (input: string): string => {
  let cleaned = input.toLowerCase();

  // Remove filler phrases
  for (const phrase of fillerPhrases) {
    cleaned = cleaned.replace(new RegExp(`\\b${phrase}\\b`, "gi"), "");
  }

  // Remove double spaces and trim
  return cleaned.replace(/\s+/g, " ").trim();
};

export const extractDate = (input: string): string | null => {
  if (input.includes("tomorrow")) return "tomorrow";
  if (input.includes("today")) return "today";
  return null;
};

export const extractEntities = (input: string): Record<string, any> => {
  console.log("🔎 extractEntities input:", input);

  const entities: Record<string, any> = {};

  // ⏱ Time extraction
  const timeMatch = input.match(/in (\d+)\s?(minutes?|hours?)/i);
  if (timeMatch) {
    entities.timeAmount = parseInt(timeMatch[1]);
    entities.timeUnit = timeMatch[2];
  }

  // 🍽 Food extraction
  const foodMatch = input.match(/(?:order|get|buy|want|like)\s+(?:some\s+)?([\w\s]+?)(?=\s+(?:from|on)\s+\w+|$)/i);
  if (foodMatch) {
    entities.food = foodMatch[1].trim();
  }

  // 📍 Destination extraction
  const destinationMatch = input.match(/(?:to|in|at)\s+([\w\s]+)/i);
  if (destinationMatch) {
    entities.destination = destinationMatch[1].trim();
  }

  // 🎵 Music extraction (add this)
  const musicMatch = input.match(/(?:play|listen to)\s+(.+)/i);
  if (musicMatch) {
    // Replace spaces with + for URL encoding
    entities.play = musicMatch[1].trim().replace(/\s+/g, "+");
  }

  return entities;
};


