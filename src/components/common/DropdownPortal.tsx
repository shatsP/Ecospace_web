import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DropdownPortalProps {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  containerRef?: React.RefObject<HTMLElement>;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({
  triggerRef,
  children,
  onClose,
  containerRef,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, flipX: false });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggerEl = triggerRef.current;
    const containerEl = containerRef?.current;

    if (triggerEl && dropdownRef.current) {
      const triggerRect = triggerEl.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const containerRect = containerEl?.getBoundingClientRect();

      // Assume dropdown width is at least 160px (w-40), adjust if needed
      const dropdownWidth = Math.max(dropdownRect.width, 160);
      const spaceRight = window.innerWidth - triggerRect.right;
      const flipX = spaceRight < dropdownWidth; // Flip to left if not enough space

      const top = triggerRect.bottom - (containerRect?.top || 0) + 4;
      const left = flipX
        ? triggerRect.left - (containerRect?.left || 0) - dropdownWidth + triggerRect.width
        : triggerRect.left - (containerRect?.left || 0);

      setPosition({ top, left, flipX });
    }

    const handleClickOutside = (e: MouseEvent) => {
      const dropdownEl = dropdownRef.current;
      const triggerEl = triggerRef.current;

      if (
        dropdownEl &&
        !dropdownEl.contains(e.target as Node) &&
        triggerEl &&
        !triggerEl.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [triggerRef, containerRef, onClose]);

  const portalTarget = containerRef?.current || document.body;

  return createPortal(
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-zinc-800 border border-zinc-700 rounded-md shadow-lg text-white max-w-[calc(100vw-16px)]"
      style={{
        top: position.top,
        left: position.left,
        position: "absolute",
      }}
    >
      {children}
    </div>,
    portalTarget
  );
};

export default DropdownPortal;