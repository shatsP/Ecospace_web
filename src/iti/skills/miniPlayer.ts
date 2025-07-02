import { create } from "zustand";
import type { SmartdropMetadata } from "../../iti/skills/smartDrop";

export type AppType =
  | "notes"
  | "timer"
  | "planner"
  | "files"
  | "smartdrop"
  | "miniplayer"
  | "settings";

interface OpenApp {
  id: string;
  type: AppType;
  isFullscreen: boolean;
  params?: Record<string, any>;
}

// --- Smartdrop Store ---
interface SmartdropStore {
  droppedFile: File | null;
  metadata: SmartdropMetadata | null;
  audioPreviewFile: File | null;
  audioURL: string | null; // Added for audio persistence
  isPlaying: boolean; // Added for playback state
  currentTime: number; // Added for current audio position
  duration: number; // Added for audio duration

  setSmartdropData: (file: File, metadata: SmartdropMetadata) => void;
  setAudioPreviewFile: (file: File | null) => void;
  setAudioState: (state: Partial<Pick<SmartdropStore, "audioURL" | "isPlaying" | "currentTime" | "duration">>) => void;
  clearSmartdrop: () => void;
}

export const useSmartdropStore = create<SmartdropStore>((set) => ({
  droppedFile: null,
  metadata: null,
  audioPreviewFile: null,
  audioURL: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,

  setSmartdropData: (file, metadata) =>
    set({
      droppedFile: file,
      metadata,
      audioURL: file.type.startsWith("audio/") ? URL.createObjectURL(file) : null,
    }),

  setAudioPreviewFile: (file) => set({ audioPreviewFile: file }),

  setAudioState: (state) => set((prev) => ({ ...prev, ...state })),

  clearSmartdrop: () =>
    set({
      droppedFile: null,
      metadata: null,
      audioPreviewFile: null,
      audioURL: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    }),
}));

// --- App State Store ---
interface AppState {
  openApps: OpenApp[];
  openApp: (type: AppType, params?: Record<string, any>) => void;
  closeApp: (id: string) => void;
  toggleFullscreen: (id: string) => void;
  appType?: AppType;

  itiChatOpen: boolean;
  toggleItiChat: (isOpen: boolean) => void;

  plannerRawTasks: string[];
  setPlannerRawTasks: (tasks: string[]) => void;

  showItiOrb: boolean;
  setShowItiOrb: (val: boolean) => void;

  triggerAddEvent: boolean;
  setTriggerAddEvent: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  openApps: [],

  openApp: (type: AppType, params?: Record<string, any>) =>
    set((state) => {
      if (type === "miniplayer") return state; // prevent multiple players
      const isAlreadyOpen = state.openApps.some((app) => app.type === type);
      if (isAlreadyOpen) return state;
      return {
        openApps: [
          ...state.openApps,
          {
            id: `${type}-${Date.now()}`,
            type,
            isFullscreen: true,
            params,
          },
        ],
      };
    }),

  closeApp: (id) =>
    set((state) => ({
      openApps: state.openApps.filter((app) => app.id !== id),
    })),

  toggleFullscreen: (id) =>
    set((state) => ({
      openApps: state.openApps.map((app) =>
        app.id === id ? { ...app, isFullscreen: !app.isFullscreen } : app
      ),
    })),

  itiChatOpen: false,
  toggleItiChat: (isOpen) => set({ itiChatOpen: isOpen }),

  plannerRawTasks: [],
  setPlannerRawTasks: (tasks) => set({ plannerRawTasks: tasks }),

  showItiOrb: false,
  setShowItiOrb: (val) => set({ showItiOrb: val }),

  triggerAddEvent: false,
  setTriggerAddEvent: (val) => set({ triggerAddEvent: val }),
}));