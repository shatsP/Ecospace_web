// src/apps/NotesApp/notesStorage.ts
export type NotesMap = Record<string, string>;
const STORAGE_KEY = "ecospace_notes";

export const getAllNotes = (): NotesMap => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
};

export const getNote = (id: string): string => {
  const notes = getAllNotes();
  return notes[id] || "";
};

export const setNote = (id: string, content: string) => {
  const notes = getAllNotes();
  notes[id] = content;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const createNote = (): string => {
  const id = Math.random().toString(36).substring(2, 8);
  const notes = getAllNotes();
  notes[id] = "";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  return id;
};

export const deleteNote = (id: string) => {
  const notes = getAllNotes();
  delete notes[id];
  localStorage.setItem("ecospace_notes", JSON.stringify(notes));
};

export const renameNote = (oldId: string, newId: string) => {
  const notes = getAllNotes();
  if (notes[newId]) throw new Error("Note ID already exists");
  notes[newId] = notes[oldId];
  delete notes[oldId];
  localStorage.setItem("ecospace_notes", JSON.stringify(notes));
};
