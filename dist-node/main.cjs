"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
// import * as fs from "fs";
const isDev = !electron_1.app.isPackaged;
const DIST_DIR = path.join(__dirname, "../dist");
const INDEX_HTML = path.join(DIST_DIR, "index.html");
// const PREFS_FILE = path.join(app.getPath("userData"), "ecospace_defaults.json");
// function readPrefs(): Record<string, string> {
//   try {
//     return JSON.parse(fs.readFileSync(PREFS_FILE, "utf-8"));
//   } catch {
//     return {};
//   }
// }
// function writePrefs(prefs: Record<string, string>) {
//   fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
// }
// const INTENT_TO_OPTIONS: Record<string, string[]> = {
//   order_food: ["https://www.swiggy.com", "https://www.zomato.com"],
//   book_taxi: ["https://www.uber.com/in/en", "https://www.olacabs.com"],
//   maps: ["https://maps.google.com"],
//   email: ["https://mail.google.com"],
//   shop_online: ["https://www.amazon.in", "https://www.flipkart.com"],
//   watch_video: ["https://www.youtube.com", "https://www.netflix.com"],
// };
// ipcMain.on("handle-intent", (_event, { intent, userInput }) => {
//   const prefs = readPrefs();
//   if (prefs[intent]) {
//     shell.openExternal(prefs[intent]);
//     return;
//   }
//   const urls = INTENT_TO_OPTIONS[intent];
//   if (!urls || urls.length === 0) return;
//   const matched = urls.find((url) =>
//     userInput.toLowerCase().includes(getKeyword(url))
//   );
//   const chosen = matched || urls[0];
//   shell.openExternal(chosen);
//   prefs[intent] = chosen;
//   writePrefs(prefs);
// });
// function getKeyword(url: string): string {
//   const map: Record<string, string> = {
//     swiggy: "swiggy",
//     zomato: "zomato",
//     uber: "uber",
//     ola: "ola",
//     google: "maps",
//     amazon: "amazon",
//     flipkart: "flipkart",
//     youtube: "youtube",
//     netflix: "netflix",
//     gmail: "mail",
//   };
//   for (const key in map) {
//     if (url.includes(key)) return map[key];
//   }
//   return "";
// }
// 🪟 Create window and load app
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: false,
            preload: path.join(__dirname, "preload.cjs"), // Optional if you use IPC securely
        },
    });
    if (isDev) {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools(); // Optional: remove for prod
    }
    else {
        win.loadFile(INDEX_HTML);
    }
}
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            console.log("Preload path:", path.join(__dirname, "../dist-node/preload.cjs"));
        createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
