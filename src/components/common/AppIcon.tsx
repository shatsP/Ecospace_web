import React from "react";

interface AppIconProps {
  label: string;
  icon: React.ReactNode;
  onOpen: () => void;
}

const AppIcon: React.FC<AppIconProps> = ({ label, icon, onOpen }) => {

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group relative"
      onClick={onOpen}
    >
      <div className="w-16 h-16 bg-zinc-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition">
        {icon}
      </div>
      <span className="text-sm text-zinc-200">{label}</span>

    </div>
  );
};

export default AppIcon;
