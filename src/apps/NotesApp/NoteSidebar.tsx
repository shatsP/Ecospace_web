// src/apps/NotesApp/NoteSidebar.tsx
import { useEffect, useState } from "react";
import {
  createNote,
  deleteNote,
  getAllNotes,
  renameNote,
} from "./noteStorage";
import { useNoteUIStore } from "./noteUiStore";

export default function NoteSidebar() {
  const { selectedNoteId, setSelectedNoteId } = useNoteUIStore();
  const [noteIds, setNoteIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const refreshNotes = () => {
    const notes = getAllNotes();
    const ids = Object.keys(notes);
    setNoteIds(ids);

    // Auto-select first note if none selected
    if (!selectedNoteId && ids.length > 0) {
      setSelectedNoteId(ids[0]);
    }
  };

  useEffect(() => {
    refreshNotes();
  }, [selectedNoteId]);

  const handleNewNote = () => {
    const newId = createNote();
    refreshNotes();
    setSelectedNoteId(newId);
  };

  const handleRename = (oldId: string) => {
    try {
      const trimmed = editValue.trim();
      if (!trimmed || trimmed === oldId) return setEditingId(null);
      renameNote(oldId, trimmed);
      setEditingId(null);
      refreshNotes();
      if (selectedNoteId === oldId) {
        setSelectedNoteId(trimmed);
      }
    } catch (err) {
      alert("Rename failed: " + (err as Error).message);
    }
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Delete this note?");
    if (!confirmDelete) return;
    deleteNote(id);
    refreshNotes();
    if (id === selectedNoteId) {
      const remaining = noteIds.filter((n) => n !== id);
      const next = remaining[0] || createNote();
      setSelectedNoteId(next);
    }
  };

  return (
    <div className="w-48 bg-gray-800 text-white p-3 space-y-2 overflow-y-auto text-sm">
      <button
        onClick={handleNewNote}
        className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded"
      >
        + New Note
      </button>

      {noteIds.map((id) => (
        <div
          key={id}
          className={`flex items-center justify-between px-2 py-1 rounded ${
            id === selectedNoteId ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          {editingId === id ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleRename(id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename(id);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="flex-1 bg-gray-900 text-white rounded px-1 text-sm"
            />
          ) : (
            <div
              className="flex-1 truncate cursor-pointer"
              onClick={() => setSelectedNoteId(id)}
              onDoubleClick={() => {
                setEditingId(id);
                setEditValue(id);
              }}
            >
              {id}
            </div>
          )}

          <button
            className="ml-1 text-red-400 hover:text-red-600"
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
