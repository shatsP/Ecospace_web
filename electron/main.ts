import { app, BrowserWindow } from "electron";
import * as path from "path";
// import * as fs from "fs";

const isDev = !app.isPackaged;
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
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname,"preload.cjs"), // Optional if you use IPC securely
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools(); // Optional: remove for prod
  } else {
    win.loadFile(INDEX_HTML);
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) 
        console.log("Preload path:", path.join(__dirname, "../dist-node/preload.cjs"));
        createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
