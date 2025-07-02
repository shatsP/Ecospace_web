//electron/preload.ts
import { contextBridge, shell } from "electron";

const INTENT_TO_OPTIONS: Record<string, string[]> = {
  order_food: ["https://www.swiggy.com", "https://www.zomato.com"],
  book_taxi: ["https://www.uber.com/in/en", "https://www.olacabs.com"],
  maps: ["https://maps.google.com"],
  email: ["https://mail.google.com"],
};

function getSmartURL(intent: string, baseURL: string, entities: Record<string, string> = {}): string {
  const safe = (val?: string) => encodeURIComponent(val || "");
  console.log(`getSmartURL called with intent=${intent}, baseURL=${baseURL}, entities=${JSON.stringify(entities)}`);


  switch (intent) {
    case "order_food": {
      const food = safe(entities.food);
      if (baseURL.includes("swiggy")) {
        return `https://www.swiggy.com/search?query=${food}`;
      }
      if (baseURL.includes("zomato")) {
        const city = "aligarh"; // hardcoded city
        return `https://www.zomato.com/${city}/delivery/dish-${food}`;
      }
      break;
    }

    case "book_taxi": {
      const destination = safe(entities.destination);
      if (baseURL.includes("uber")) return `https://m.uber.com/?action=setPickup&drop[description]=${destination}`;
      if (baseURL.includes("ola")) return `https://book.olacabs.com/?drop=${destination}`;
      break;
    }

    case "maps": {
      const query = safe(entities.destination || entities.food);
      return `https://www.google.com/maps/search/${query}`;
    }
  }

  return baseURL;
}


function handleIntent(intent: string, userInput: string, entities?: Record<string, string>) {
  const prefs = JSON.parse(localStorage.getItem("ecospace_defaults") || "{}");

  // if (prefs[intent]) {
  //    shell.openExternal(prefs[intent]);
  //   return;
  // }

  const urls = INTENT_TO_OPTIONS[intent];
  if (!urls) return;

  const matched = urls.find((url) =>
    userInput.toLowerCase().includes(getKeyword(url))
  );
  const chosen = matched || urls[0];

  const finalURL = getSmartURL(intent, chosen, entities || {});
  console.log("🌐 Opening external URL...");
  console.log("Opening final URL:", finalURL);
  shell.openExternal(finalURL);

  prefs[intent] = finalURL;
  localStorage.setItem("ecospace_defaults", JSON.stringify(prefs));
}

function getKeyword(url: string) {
  return url.match(/swiggy|zomato|uber|ola|google/)?.[0] || "";
}

contextBridge.exposeInMainWorld("ecospace", {
  launchByIntent: (intent: string, input: string, entities?: Record<string, string>) =>
    handleIntent(intent, input, entities)
});

