import { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ItiSuggestionPanel from "../ItiSuggestionPanel";
import { useNoteUIStore } from "../../../apps/NotesApp/noteUiStore";
import { useAppStore, useSmartdropStore } from "../../../core/StateStore";
import ItiNotifications from "../ItiNotitfications";
import { useNotificationStore } from "../../../core/notificationStore";
import { IoPlay, IoPause, IoClose } from "react-icons/io5";
import ItiMiniBar from "./ItiMiniBar";
import ItiMiniChat from "./ItiMiniChat";
import { exportWeekAsPDF } from "../../../utils/exportPdf";
import { updateUserMeta } from "../../../core/userMetaStore";
import { useTimerStore } from "../../../apps/TimerApp/useTimerStore";

export default function ItiOrb({ appType }: { appType: string }) {
  const [showMetadata, setShowMetadata] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showMiniChat, setShowMiniChat] = useState(false);
  const [miniMessages, setMiniMessages] = useState<{ sender: "user" | "iti"; text: string }[]>([]);


  const containerRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const noteId = useNoteUIStore((s) => s.selectedNoteId);
  const { setTriggerAddEvent, openApp } = useAppStore();
  const notifications = useNotificationStore((s) => s.notifications);
  const hasNotifications = notifications.length > 0;
  const { droppedFile, metadata } = useSmartdropStore();
  const addReminder = useTimerStore((s) => s.addReminder);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const isAudio = droppedFile?.type.startsWith("audio/");
  const audioURL = useMemo(() => {
    if (isAudio && droppedFile) {
      return URL.createObjectURL(droppedFile);
    }
    return null;
  }, [droppedFile]);

  useEffect(() => {
    if (droppedFile) {
      setShowPanel(true);
      setShowMetadata(true);

      const last = JSON.parse(localStorage.getItem("ecospace_user_meta") || "{}")?.lastDroppedFile;
      if (last?.name !== droppedFile.name || last?.size !== droppedFile.size) {
        updateUserMeta({
          lastDroppedFile: {
            name: droppedFile.name,
            type: droppedFile.type,
            size: droppedFile.size,
            time: new Date().toISOString(),
          },
        });
      }
    }
  }, [droppedFile]);

  useEffect(() => {
    return () => {
      if (audioRef.current?.src?.startsWith("blob:")) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const el = audioRef.current;
      el.addEventListener("loadedmetadata", () => setDuration(el.duration));
    }
  }, [audioURL]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !miniRef.current?.contains(target) &&
        !metadataRef.current?.contains(target)
      ) {
        setShowPanel(false);
        setShowMiniChat(false);
        setShowMetadata(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSuggestionClick = async (label: string) => {
    const { addNotification } = useNotificationStore.getState();

    if (appType === "timer" && label === "Add Reminder") {
      const reminder = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        text: "New reminder",
        time: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      };
      addReminder(reminder);
      addNotification({ message: "Reminder added!", type: "success" });
      return;
    }

    if (appType === "notes" && label === "Export as PDF") {
      if (!noteId) return addNotification({ message: "No note selected.", type: "warning" });
      const raw = localStorage.getItem("ecospace_notes");
      const notes = JSON.parse(raw || "{}");
      const content = notes[noteId];
      if (!content?.trim()) return addNotification({ message: "Note is empty.", type: "warning" });

      const mod = await import("../../../apps/NotesApp");
      mod.exportNoteToPDF(content, `${noteId}.pdf`);
      addNotification({ message: "PDF downloaded!", type: "success" });
    }

    if (appType === "planner" && label === "Export week") {
      try {
        await exportWeekAsPDF("planner-week-view");
        addNotification({ message: "Planner PDF downloaded!", type: "success" });
      } catch (err) {
        addNotification({ message: "Failed to export planner.", type: "error" });
      }
      return;
    }

    if (appType === "planner" && label === "Add Event") {
      setTriggerAddEvent(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-10 right-10 z-50 flex flex-col items-end space-y-2"
    >
      {isAudio && audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="mb-2 w-full">
        <ItiNotifications />
      </div>

      {droppedFile && showPanel && isAudio && audioURL && (
        <div className="p-4 rounded-xl bg-zinc-900/90 text-white w-72 shadow-xl flex flex-col items-center gap-3">
          <div className="flex justify-between items-center w-full">
            <span className="truncate text-sm max-w-[200px]">{droppedFile.name}</span>
            <button onClick={() => setShowPanel(false)} className="text-zinc-400 hover:text-red-400">
              <IoClose size={18} />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full mt-2">
            <button onClick={togglePlay} className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700">
              {isPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full"
            />
          </div>
        </div>
      )}

      {droppedFile && showPanel && metadata && !isAudio && showMetadata && (
        <div
          ref={metadataRef}
          className="relative bg-zinc-900 p-4 rounded-xl shadow-lg text-white mb-2 w-[240px]"
        >
          <button
            onClick={() => {
              setShowMetadata(false);
              useSmartdropStore.getState().clearSmartdrop();
            }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-800 hover:bg-red-600 flex items-center justify-center text-sm text-red-400 hover:text-white transition"
            title="Close"
          >
            ✕
          </button>

          <div className="font-semibold text-lg mb-1">📄 Dropped File</div>
          <div className="text-sm text-zinc-300 space-y-1">
            <p><strong>Name:</strong> {metadata.name}</p>
            <p><strong>Type:</strong> {metadata.type}</p>
            <p><strong>Size:</strong> {metadata.size}</p>
            <p><strong>Extension:</strong> {metadata.extension}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              className="px-3 py-1 text-sm rounded bg-indigo-600 hover:bg-indigo-700"
              onClick={() => openApp("smartdrop")}
            >
              Open
            </button>
            {metadata.extension === "txt" && (
              <button
                className="px-3 py-1 text-sm rounded bg-zinc-700 hover:bg-zinc-600"
                onClick={() =>
                  useNotificationStore.getState().addNotification({
                    message: "Coming soon: text summarization ✨",
                    type: "info",
                  })
                }
              >
                Summarize
              </button>
            )}
          </div>
        </div>
      )}

      {(showPanel || showMiniChat) && (
        <div ref={miniRef} className="space-y-2 flex flex-col items-end">
          <ItiMiniBar
            onTyping={() => {
              setShowMiniChat(true);
              setShowPanel(true);
            }}
            
          onMessageSubmit={(text, reply) =>
            setMiniMessages((prev) => [
              ...prev,
              { sender: "user", text },
              { sender: "iti", text: reply },
            ])
          }

          />
          {showMiniChat && (
            <ItiMiniChat
              messages={miniMessages}
              onClose={() => setShowMiniChat(false)}
            />
          )}
        </div>
      )}

      {showPanel && !showMiniChat && (
        <div className={`transition-all duration-300 ${hasNotifications ? "mb-16" : "mb-2"}`}>
          <ItiSuggestionPanel
            appType={appType}
            onClose={() => setShowPanel(false)}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      )}

      {!showMiniChat && (
        <motion.div
          className="w-12 h-12 rounded-full bg-indigo-500 shadow-lg cursor-pointer"
          animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={() => setShowPanel((prev) => !prev)}
        />
      )}
    </div>
  );
}