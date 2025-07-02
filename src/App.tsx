// src/App.tsx
import React from "react";
import DesktopLayout from "./components/layout/DesktopLayout";
import { MemoryRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <MemoryRouter>
      <DesktopLayout />
    </MemoryRouter>
  );
};

export default App;
