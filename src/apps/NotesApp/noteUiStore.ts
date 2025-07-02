// src/apps/NotesApp/noteUiStore.ts
import { create } from "zustand";

interface NoteUIState {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string) => void;
}

export const useNoteUIStore = create<NoteUIState>((set) => ({
  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),
}));
