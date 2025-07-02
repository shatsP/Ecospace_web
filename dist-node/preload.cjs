"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// electron/preload.ts
const electron_1 = require("electron");
const INTENT_TO_OPTIONS = {
    order_food: ["https://www.swiggy.com", "https://www.zomato.com"],
    book_taxi: ["https://www.uber.com/in/en", "https://www.olacabs.com"],
    maps: ["https://maps.google.com"],
    email: ["https://mail.google.com"],
    play_music: ["https://www.youtube.com"], // ✅ Added YouTube for music
};
function getSmartURL(intent, baseURL, entities = {}) {
    const safe = (val) => encodeURIComponent(val || "");
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
            if (baseURL.includes("uber")) {
                return `https://m.uber.com/?action=setPickup&drop[description]=${destination}`;
            }
            if (baseURL.includes("ola")) {
                return `https://book.olacabs.com/?drop=${destination}`;
            }
            break;
        }
        case "maps": {
            const query = safe(entities.destination || entities.food);
            return `https://www.google.com/maps/search/${query}`;
        }
        case "play_music": {
            const query = safe(entities.play);
            return `https://www.youtube.com/results?search_query=${query}`;
        }
    }
    return baseURL;
}
function handleIntent(intent, userInput, entities) {
    const prefs = JSON.parse(localStorage.getItem("ecospace_defaults") || "{}");
    const urls = INTENT_TO_OPTIONS[intent];
    if (!urls)
        return;
    const matched = urls.find((url) => userInput.toLowerCase().includes(getKeyword(url)));
    const chosen = matched || urls[0];
    const finalURL = getSmartURL(intent, chosen, entities || {});
    console.log("🌐 Opening external URL...");
    console.log("Opening final URL:", finalURL);
    electron_1.shell.openExternal(finalURL);
    prefs[intent] = finalURL;
    localStorage.setItem("ecospace_defaults", JSON.stringify(prefs));
}
function getKeyword(url) {
    return url.match(/swiggy|zomato|uber|ola|google|youtube/)?.[0] || "";
}
electron_1.contextBridge.exposeInMainWorld("ecospace", {
    launchByIntent: (intent, input, entities) => handleIntent(intent, input, entities)
});
