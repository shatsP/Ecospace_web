import { useEffect, useState } from "react";
import { useSmartdropStore } from "../../core/StateStore";

export default function Smartdrop() {
  const { droppedFile, metadata } = useSmartdropStore();
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);

  // ❌ Ignore audio files entirely
  if (droppedFile?.type.startsWith("audio/")) {
    return (
      <div className="p-4 text-white">
        This file is being played in the MiniPlayer.
      </div>
    );
  }

  useEffect(() => {
    if (!droppedFile || !metadata?.extension) return;

    const ext = metadata.extension.toLowerCase();

    if (["txt", "rtf"].includes(ext)) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewContent(reader.result as string);
      };
      reader.readAsText(droppedFile);
    }

    if (["png", "jpg", "jpeg", "pdf"].includes(ext)) {
      const url = URL.createObjectURL(droppedFile);
      setFileURL(url);
    }

    return () => {
      if (fileURL) URL.revokeObjectURL(fileURL);
    };
  }, [droppedFile, metadata]);

  if (!metadata) return <div className="p-4 text-white">No file dropped.</div>;

  return (
    <div className="p-6 space-y-6 text-white">
      {/* Text Preview */}
      {previewContent && (
        <div className="bg-zinc-800 p-4 rounded text-sm overflow-auto max-h-[300px]">
          <h3 className="text-md font-semibold mb-2">📝 Text Preview</h3>
          <pre className="whitespace-pre-wrap">{previewContent}</pre>
        </div>
      )}

      {/* PDF Preview */}
      {fileURL && metadata.extension === "pdf" && (
        <div>
          <h3 className="text-md font-semibold mb-2">📄 PDF Preview</h3>
          <embed src={fileURL} type="application/pdf" className="w-full h-[700px] rounded" />
        </div>
      )}

      {/* Image Preview */}
      {fileURL && ["png", "jpg", "jpeg"].includes(metadata.extension) && (
        <div>
          <h3 className="text-md font-semibold mb-2">🖼️ Image Preview</h3>
          <img src={fileURL} alt={metadata.name} className="max-w-full rounded" />
        </div>
      )}

      {/* Fallback */}
      {!previewContent && !fileURL && (
        <div className="text-zinc-400">
          ⚠️ Preview not available for this file type.
        </div>
      )}
    </div>
  );
}
