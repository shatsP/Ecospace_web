import { shell, app } from "electron";
import fs from "fs";
import path from "path";

const PREFS_FILE = path.join(app.getPath("userData"), "ecospace_defaults.json");

const INTENT_TO_OPTIONS: Record<string, string[]> = {
  order_food: ["https://www.swiggy.com", "https://www.zomato.com"],
  book_taxi: ["https://www.uber.com/in/en", "https://www.olacabs.com"],
  maps: ["https://maps.google.com"],
  email: ["https://mail.google.com"],
};

function readPrefs(): Record<string, string> {
  try {
    return JSON.parse(fs.readFileSync(PREFS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writePrefs(prefs: Record<string, string>) {
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}

// 🧠 New: Smart URL manipulation based on intent + entities
function getSmartURL(intent: string, baseURL: string, entities: Record<string, string> = {}): string {

  switch (intent) {
    case "launch_order_food": {
      const query = entities.food || "";
      if (baseURL.includes("swiggy.com")) {
        return `https://www.swiggy.com/search?query=${encodeURIComponent(query)}`;
      }
      if (baseURL.includes("zomato.com")) {
        return `https://www.zomato.com/search?query=${encodeURIComponent(query)}`;
      }
      break;
    }

    case "launch_book_taxi": {
      const destination = entities.destination || "";
      if (baseURL.includes("uber.com")) {
        return `https://m.uber.com/?action=setPickup&drop[description]=${encodeURIComponent(destination)}`;
      }
      if (baseURL.includes("olacabs.com")) {
        return `https://book.olacabs.com/?drop=${encodeURIComponent(destination)}`;
      }
      break;
    }

    case "launch_maps": {
      const place = entities.destination || entities.food || "";
      return `https://www.google.com/maps/search/${encodeURIComponent(place)}`;
    }
  }

  return baseURL;
}

export function handleIntent(intent: string, userInput: string, entities?: Record<string, string>) {
  const prefs = readPrefs();

  // Use previously preferred app if saved
  if (prefs[intent]) {
    const smartURL = getSmartURL(intent, prefs[intent], entities || {});
    shell.openExternal(smartURL);
    return;
  }

  const urls = INTENT_TO_OPTIONS[intent.replace("launch_", "")];
  if (!urls || urls.length === 0) return;

  const matched = urls.find(url =>
    userInput.toLowerCase().includes(getKeyword(url))
  );
  const chosen = matched || urls[0];

  const finalURL = getSmartURL(intent, chosen, entities || {});
  shell.openExternal(finalURL);

  prefs[intent] = chosen;
  writePrefs(prefs);
}

function getKeyword(url: string): string {
  if (url.includes("swiggy")) return "swiggy";
  if (url.includes("zomato")) return "zomato";
  if (url.includes("uber")) return "uber";
  if (url.includes("ola")) return "ola";
  if (url.includes("google")) return "google";
  return "";
}
