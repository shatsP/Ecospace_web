"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIntent = handleIntent;
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PREFS_FILE = path_1.default.join(electron_1.app.getPath("userData"), "ecospace_defaults.json");
const INTENT_TO_OPTIONS = {
    order_food: ["https://www.swiggy.com", "https://www.zomato.com"],
    book_taxi: ["https://www.uber.com/in/en", "https://www.olacabs.com"],
    maps: ["https://maps.google.com"],
    email: ["https://mail.google.com"],
    play_music: ["https://www.youtube.com"], // ✅ Added default platform
};
function readPrefs() {
    try {
        return JSON.parse(fs_1.default.readFileSync(PREFS_FILE, "utf-8"));
    }
    catch {
        return {};
    }
}
function writePrefs(prefs) {
    fs_1.default.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}
// 🧠 Smart URL generation based on intent + entities
function getSmartURL(intent, baseURL, entities = {}) {
    const safe = (val) => encodeURIComponent(val || "");
    switch (intent) {
        case "launch_order_food": {
            const query = safe(entities.food);
            if (baseURL.includes("swiggy.com")) {
                return `https://www.swiggy.com/search?query=${query}`;
            }
            if (baseURL.includes("zomato.com")) {
                return `https://www.zomato.com/aligarh/delivery/dish-${query}`;
            }
            break;
        }
        case "launch_book_taxi": {
            const destination = safe(entities.destination);
            if (baseURL.includes("uber.com")) {
                return `https://m.uber.com/?action=setPickup&drop[description]=${destination}`;
            }
            if (baseURL.includes("olacabs.com")) {
                return `https://book.olacabs.com/?drop=${destination}`;
            }
            break;
        }
        case "launch_maps": {
            const place = safe(entities.destination || entities.food);
            return `https://www.google.com/maps/search/${place}`;
        }
        case "launch_play_music": {
            const song = safe(entities.play);
            return `https://www.youtube.com/results?search_query=${song}`;
        }
    }
    return baseURL;
}
function handleIntent(intent, userInput, entities) {
    const prefs = readPrefs();
    // Use previously preferred app if saved
    if (prefs[intent]) {
        const smartURL = getSmartURL(intent, prefs[intent], entities || {});
        electron_1.shell.openExternal(smartURL);
        return;
    }
    const baseKey = intent.replace("launch_", "");
    const urls = INTENT_TO_OPTIONS[baseKey];
    if (!urls || urls.length === 0)
        return;
    const matched = urls.find(url => userInput.toLowerCase().includes(getKeyword(url)));
    const chosen = matched || urls[0];
    const finalURL = getSmartURL(intent, chosen, entities || {});
    electron_1.shell.openExternal(finalURL);
    prefs[intent] = chosen;
    writePrefs(prefs);
}
function getKeyword(url) {
    if (url.includes("swiggy"))
        return "swiggy";
    if (url.includes("zomato"))
        return "zomato";
    if (url.includes("uber"))
        return "uber";
    if (url.includes("ola"))
        return "ola";
    if (url.includes("google"))
        return "google";
    if (url.includes("youtube"))
        return "youtube";
    return "";
}
