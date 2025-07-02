import React, { useState, useEffect, useRef } from "react";
import ItiBar from "../iti/ItiBar";
import MicroAppCanvas from "../MicroAppCanvas";
import AppIcon from "../common/AppIcon";
import { FaStickyNote, FaClock, FaCalendarAlt, } from "react-icons/fa";
import { useAppStore } from "../../core/StateStore";
import ItiChat from "../iti/ItiChat";
import { updateUserMeta } from "../../core/userMetaStore";
import { ReminderChecker } from "../../core/ReminderChecker";
import ClockOverlay from "../ClockOverlay";
import { FaSection } from "react-icons/fa6";

const DesktopLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null); // NEW: for outside click
  const { toggleItiChat } = useAppStore(); // NEW: to close ItiChat

  const handleOpenNotes = () => {
    useAppStore.getState().openApp("notes");
    updateUserMeta({ lastOpenedApp: "notes" });
  };

  const handleOpenTimer = () => {
    useAppStore.getState().openApp("timer");
    updateUserMeta({ lastOpenedApp: "timer" });
  };

  const handleOpenPlanner = () => {
    useAppStore.getState().openApp("planner");
    updateUserMeta({ lastOpenedApp: "planner" });
  };

  const handleOpenSettings = () => {
    useAppStore.getState().openApp("settings");
    updateUserMeta({ lastOpenedApp: "settings" });
  };

  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const load = () => {
      const settings = JSON.parse(localStorage.getItem("ecospace_settings") || "{}");
      setBackgroundImage(settings.wallpaper || "");
    };

    load();
    const interval = setInterval(load, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        toggleItiChat(false); // Close chat if clicked outside the chat+bar container
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* wallpaper */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center transition-all duration-300"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(to bottom right, #18181b, #27272a)",
        }}
      />

      <ReminderChecker />

      {/* app icons */}
      <div className="absolute top-10 left-10 grid grid-cols-2 gap-6 z-10">
        <AppIcon label="Notes" icon={<FaStickyNote size={28} />} onOpen={handleOpenNotes} />
        <AppIcon label="Timer" icon={<FaClock size={28} />} onOpen={handleOpenTimer} />
        <AppIcon label="Planner" icon={<FaCalendarAlt size={28} />} onOpen={handleOpenPlanner} />
        <AppIcon label="Settings" icon={<FaSection size={28} />} onOpen={handleOpenSettings} />
        <ClockOverlay position="top-center" onClick={handleOpenTimer} />
      </div>

      <div className="absolute inset-0 z-20 relative">
        <MicroAppCanvas />
      </div>

      {/* 🧠 WRAPPED ItiBar + ItiChat for click-outside detection */}
      <div ref={containerRef} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <ItiBar />
        <ItiChat />
      </div>
    </div>
  );
};

export default DesktopLayout;