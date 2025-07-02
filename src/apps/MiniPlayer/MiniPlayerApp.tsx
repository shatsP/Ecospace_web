import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoPlay, IoPause, IoClose } from "react-icons/io5";
import { useAppStore } from "../../core/StateStore";

const MiniPlayerApp: React.FC<{ file?: File }> = ({ file }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const { closeApp, openApps } = useAppStore();
  const app = openApps.find((a) => a.type === "miniplayer");

  // ✅ Create and memoize audio URL
  const audioURL = useMemo(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      console.log("Audio file URL created:", url);
      return url;
    }
    return null;
  }, [file]);

  // ✅ Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current?.src?.startsWith("blob:")) {
        console.log("Revoking blob URL on unmount:", audioRef.current.src);
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, []);

  // Update time as song plays
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    console.log("Toggle play called. Is playing:", isPlaying);
    if (isPlaying) {
      audioRef.current.pause();
      console.log("Paused audio.");
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log("Started audio playback."))
          .catch((err) => console.error("Audio playback failed:", err));
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      console.log("Seeked to:", newTime);
    }
  };

  const handleClose = () => {
    if (app) closeApp(app.id);
  };

  if (!file) return <div className="text-white p-4">Drop an MP3 to play</div>;

  return (
    <div className="p-4 rounded-xl bg-zinc-900/90 text-white w-72 shadow-xl flex flex-col items-center gap-3">
      <div className="flex justify-between items-center w-full">
        <span className="truncate text-sm max-w-[200px]">{file.name}</span>
        <button onClick={handleClose} className="text-zinc-400 hover:text-red-400">
          <IoClose size={18} />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={audioURL || undefined}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => console.log("Audio element playing")}
        onPause={() => console.log("Audio element paused")}
        onCanPlay={() => console.log("Audio can play")}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
            console.log("Loaded metadata, duration:", audioRef.current.duration);
          }
        }}
        onError={(e) => console.error("Audio error:", e)}
      />

      <div className="flex items-center gap-3 w-full mt-2">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700"
        >
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
  );
};

export default MiniPlayerApp;
