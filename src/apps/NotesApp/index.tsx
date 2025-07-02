import {
  useImperativeHandle,
  useState,
  forwardRef,
  useEffect,
} from "react";
import jsPDF from "jspdf";
import { getNote, setNote } from "./noteStorage";
import { useDebouncedCallback } from "use-debounce";
import { useNoteUIStore } from "./noteUiStore";


export interface NotesAppHandle {
  exportToPDF: () => void;
  downloadTxt: () => void;
}

export const exportNoteToPDF = (note: string, filename = "note.pdf") => {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(note || " ", 180);
  doc.text(lines, 10, 10);
  doc.save(filename);
};

const NotesApp = forwardRef<NotesAppHandle>((_, ref) => {
  const noteId = useNoteUIStore((s) => s.selectedNoteId);
  const [note, setNoteState] = useState("");


  useEffect(() => {
    if (noteId) {
      const content = getNote(noteId);
      setNoteState(content);
    }
  }, [noteId]);

  const debouncedSave = useDebouncedCallback((value: string) => {
    if (noteId) setNote(noteId, value);
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNoteState(e.target.value);
    debouncedSave(e.target.value);
  };

  useImperativeHandle(ref, () => ({
    exportToPDF: () => {
      exportNoteToPDF(note);
    },
    downloadTxt: () => {
      const blob = new Blob([note], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${noteId || "note"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    },
  }));

  if (!noteId) {
    return <div className="text-white p-4">No note selected.</div>;
  }

  return (
    <div className="w-full h-full p-4 text-white flex flex-col gap-1">
      <textarea
        value={note}
        onChange={handleChange}
        className="flex-1 bg-zinc-800 p-2 rounded-lg resize-none text-white"
        placeholder="Write your note..."
      />
    </div>
  );
});

export default NotesApp;