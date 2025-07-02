import { useEffect, useState } from "react";

const builtInWallpapers = [
  "/wallpapers/wall1.jpg",
  "/wallpapers/wall2.jpg",
  "/wallpapers/wall4.jpg",
  "/wallpapers/wall5.jpg",
];

type EcospaceSettings = {
  wallpaper: string;
  theme?: "light" | "dark" | "system";
};

export default function SettingsApp() {
  const [settings, setSettings] = useState<EcospaceSettings>({
    wallpaper: "",
    theme: "system",
  });

  useEffect(() => {
    const stored = localStorage.getItem("ecospace_settings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSetting = (key: keyof EcospaceSettings, value: any) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("ecospace_settings", JSON.stringify(updated));
  };

  const handleCustomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateSetting("wallpaper", dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 space-y-8 text-white">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Wallpaper Section */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Wallpaper</h2>
        <div className="grid grid-cols-3 gap-4">
          {builtInWallpapers.map((url) => (
            <div
              key={url}
              className={`border-2 rounded-xl cursor-pointer transition-all hover:scale-105 ${
                settings.wallpaper === url ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => updateSetting("wallpaper", url)}
            >
              <img src={url} className="w-full h-24 object-cover rounded-xl" />
            </div>
          ))}
          <label className="flex items-center justify-center border rounded-xl h-24 cursor-pointer bg-gray-800 hover:bg-gray-700">
            <input type="file" accept="image/*" onChange={handleCustomImage} className="hidden" />
            <span className="text-sm">Upload</span>
          </label>
        </div>
      </section>

      {/* Theme Section (Optional for now) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Theme</h2>
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={settings.theme}
          onChange={(e) => updateSetting("theme", e.target.value as EcospaceSettings["theme"])}
        >
          <option value="system">System Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </section>
    </div>
  );
}
