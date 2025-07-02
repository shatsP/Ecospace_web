import React, { useRef } from "react";
import { Rnd } from "react-rnd";
import { useAppStore } from "../../core/StateStore";
import DropdownPortal from "./DropdownPortal";

interface WindowShellProps {
  children: React.ReactNode;
  onClose?: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  appType?: string;
  appId: string;
  isFullScreen?: boolean;
  appRef?: React.RefObject<any>; // made generic to support any app
  menuButton?: React.ReactNode;
  dropdown?: React.ReactNode;
  menuButtonRef?: React.RefObject<HTMLElement | null>;

}

const WindowShell: React.FC<WindowShellProps> = ({
  children,
  onClose,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  appType,
  menuButtonRef,
  appId,
  isFullScreen = false,
  menuButton,
  dropdown,
}) => {
  const rndRef = useRef<any>(null);
  const { toggleFullscreen } = useAppStore();

  return (
    <div className="relative w-full h-screen">
      <Rnd
        ref={rndRef}
        default={{ ...defaultPosition, ...defaultSize }}
        size={isFullScreen ? { width: "100%", height: "100%" } : undefined}
        position={isFullScreen ? { x: 0, y: 0 } : undefined}
        enableResizing={!isFullScreen}
        disableDragging={isFullScreen}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        dragHandleClassName="drag-handle"
        className="rounded-xl shadow-xl border border-zinc-700 bg-zinc-900 overflow-hidden transition-all duration-300"
        onDrag={(_e, d) => {
          if (d.y < 0) {
            rndRef.current.updatePosition({ x: d.x, y: 0 });
          }
        }}
      >
        <div className="w-full h-full flex flex-col relative">
          {/* Header */}
          <div
            className="drag-handle bg-zinc-800 text-white p-2 text-sm font-semibold cursor-move select-none relative"
            onDoubleClick={() => toggleFullscreen(appId)}
          >
            {appType?.toUpperCase()}

            {/* Right side controls */}
            <div className="absolute top-1 right-2 flex items-center gap-2">
              {menuButton && (
                <div className="relative" ref={menuButtonRef as React.RefObject<HTMLDivElement>}>
                  {menuButton}
                </div>
              )}
              {dropdown && menuButtonRef && (
                <DropdownPortal triggerRef={menuButtonRef} onClose={() => {}}>
                  {dropdown}
                </DropdownPortal>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-500"
                  title="Close"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* App Body */}
          <div className="flex-1">{children}</div>
        </div>
      </Rnd>
    </div>
  );
};

export default WindowShell;
