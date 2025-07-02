// src/components/iti/ItiBar.tsx
import React, { useState } from "react";
import { FaStickyNote, FaClock, FaCalendarAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { handleItiInput } from "../../iti/ItiEngine";
import { extractMetadata } from "../../iti/skills/smartDrop";
import { useSmartdropStore, useAppStore } from "../../core/StateStore";
import { FaDroplet, FaSection } from "react-icons/fa6";
import { getContextualGreeting } from "../../utils/greetings";
import { getLLMFallbackResponse } from "../../llm/fallbackLLM";

const appMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  notes: { icon: <FaStickyNote size={20} />, label: "Notes" },
  timer: { icon: <FaClock size={20} />, label: "Timer" },
  planner: { icon: <FaCalendarAlt size={20} />, label: "Planner" },
  settings: {icon: <FaSection size={20} />, label: "Settings" },
  smartdrop: {icon: <FaDroplet size={20} />, label: "SmartDrop"},
};
const greeting = getContextualGreeting();

const ItiBar: React.FC = () => {
  const { openApps, closeApp } = useAppStore();
  const [input, setInput] = useState("");

  const activeApp = openApps[0]; // MVP: Only first open app

  const handleClose = () => {
    if (activeApp) closeApp(activeApp.id);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      const { addMessage, toggleItiChat } = useAppStore.getState();

      const userInput = input.trim();
      addMessage({ sender: "user", text: userInput });

      const response = handleItiInput(userInput);
      console.log("Parsed intent:", response.intent);

      if (response.intent?.startsWith("launch_")) {
        //const intent = response.intent.replace("launch_", "");
        //window.ecospace.launchByIntent(intent, userInput);
        toggleItiChat(true);
      } else if (response.intent?.startsWith("open_")) {
        toggleItiChat(false);
      } else if (!response.intent || response.intent === "unknown") {
        toggleItiChat(true);
        const fallback = await getLLMFallbackResponse(userInput);
        if (fallback) {
          addMessage({ sender: "iti", text: fallback });
        } else {
          addMessage({ sender: "iti", text: "I'm not sure how to help with that." });
        }
      } else {
        toggleItiChat(true);
        addMessage({ sender: "iti", text: "Intent processed locally." });
      }

      setInput("");
    }
  };

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  if (!file) return;

  const metadata = extractMetadata(file);
  const { setSmartdropData, setAudioPreviewFile } = useSmartdropStore.getState();
  const { openApp } = useAppStore.getState();

  setSmartdropData(file, metadata);

  if (file.type.startsWith("audio/")) {
    console.log("Audio file detected. Setting audio preview...");
    setAudioPreviewFile(file);
    return
  }

  openApp("smartdrop");
};

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isAppOpen = !!activeApp;
  const meta = activeApp ? appMeta[activeApp.type] : null;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`transition-all duration-300 ease-in-out flex items-center border border-zinc-700 backdrop-blur-lg shadow-lg rounded-full bg-zinc-800/80 ${
        isAppOpen ? "px-4 py-2 w-64" : "px-8 py-2 w-full max-w-7xl mx-auto"
      }`}
    >
      {isAppOpen && meta ? (
        <div className="flex items-center justify-between w-full text-white px-2">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span className="text-sm">{meta.label}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-red-400 transition-colors"
            title={`Close ${meta.label}`}
          >
            <IoClose size={18} />
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={greeting}
          className="flex-1 bg-transparent outline-none text-white placeholder-zinc-400 px-4 py-2 min-w-[400px]"
        />
      )}
    </div>
  );
};

export default ItiBar;
