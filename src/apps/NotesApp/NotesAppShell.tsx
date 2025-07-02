// src/apps/NotesApp/NotesAppShell.tsx
import { forwardRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotesApp, { type NotesAppHandle } from "./index";
import NoteSidebar from "./NoteSidebar";

const NotesAppShell = forwardRef<NotesAppHandle>((_, ref) => {
  return (
      <div className="flex h-full w-full bg-zinc-900">
        <NoteSidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/notes/:noteId" element={<NotesApp ref={ref} />} />
            <Route path="*" element={<Navigate to="/notes/default" />} />
          </Routes>
        </div>
      </div>
  );
});

export default NotesAppShell;
