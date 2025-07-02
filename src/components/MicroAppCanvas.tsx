import React, { useRef, useState } from "react";
import { useAppStore } from "../core/StateStore";
import WindowShell from "./common/WindowShell";
import type { NotesAppHandle } from "../apps/NotesApp";
import NotesAppShell from "../apps/NotesApp/NotesAppShell";
import PlannerApp from "../apps/PlannerApp/PlannerApp";
import TimerApp from "../apps/TimerApp/TimerApp";
import ItiOrb from "./iti/orb/ItiOrb";
import Smartdrop from "../components/iti/SmartDrop";
import MiniPlayerApp from "../apps/MiniPlayer/MiniPlayerApp";
import SettingsApp from "../apps/Settings/SettingsApp";

const MicroAppCanvas: React.FC = () => {
  const { openApps, closeApp } = useAppStore();

  const notesRef = useRef<NotesAppHandle>(null);
  const [plannerTrigger, setPlannerTrigger] = useState<Record<string, boolean>>({});

  return (
    <div className="relative w-full h-full overflow-hidden">
      {openApps.map((app) => {
        switch (app.type) {
          case "notes":
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={app.isFullscreen}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 100, y: 100 }}
                appRef={notesRef}
              >
                <NotesAppShell ref={notesRef} />
              </WindowShell>
            );

          case "miniplayer":
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={false}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 400, y: 100 }}
              >
                <MiniPlayerApp file={app.params?.file} />
              </WindowShell>
            );

          case "settings":
            return(
              <WindowShell
              key={app.id}
              appId={app.id}
              appType={app.type}
              isFullScreen={app.isFullscreen}
              onClose={() => closeApp(app.id)}
              defaultPosition={{ x: 300, y: 300 }}
              >
                <SettingsApp />
              </WindowShell>
            )

          case "timer":
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={app.isFullscreen}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 200, y: 200 }}
              >
                <TimerApp />
              </WindowShell>
            );

          case "smartdrop":
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={app.isFullscreen}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 250, y: 250 }}
              >
                <Smartdrop />
              </WindowShell>
            );

          case "planner":
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={app.isFullscreen}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 150, y: 150 }}
              >
                <PlannerApp
                  triggerAddEvent={plannerTrigger[app.id] || false}
                  onAddEventHandled={() =>
                    setPlannerTrigger((prev) => ({ ...prev, [app.id]: false }))
                  }
                />
              </WindowShell>
            );

          default:
            return (
              <WindowShell
                key={app.id}
                appId={app.id}
                appType={app.type}
                isFullScreen={app.isFullscreen}
                onClose={() => closeApp(app.id)}
                defaultPosition={{ x: 100, y: 100 }}
              >
                <div className="text-white p-4">Unknown App</div>
              </WindowShell>
            );
        }
      })}

      {openApps.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <ItiOrb appType={openApps[0]?.type} />
        </div>
      )}
    </div>
  );
};

export default MicroAppCanvas;
