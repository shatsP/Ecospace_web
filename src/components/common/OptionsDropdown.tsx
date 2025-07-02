import React from "react";

interface OptionsDropdownProps {
  onExportPDF: () => void;
  onDownloadTxt: () => void;
  onSaveInApp: () => void;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  onExportPDF,
  onDownloadTxt,
  onSaveInApp,
}) => {
  return (
    <div className="absolute right-0 mt-1 bg-zinc-800 border border-zinc-600 rounded-md shadow-lg z-50 w-56 p-2 flex flex-col gap-2">
      <button
        onClick={onExportPDF}
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 rounded-md"
      >
        Export to PDF
      </button>
      <button
        onClick={onDownloadTxt}
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 rounded-md"
      >
        Save as .txt
      </button>
      <button
        onClick={onSaveInApp}
        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 rounded-md"
      >
        Save in App
      </button>
    </div>
  );
};

export default OptionsDropdown;
