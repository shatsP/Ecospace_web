// src/components/iti/ItiSuggestionPanel.tsx
import { useState, useMemo } from "react";
import { suggestionMap } from "../../iti/NLP/suggestionRules";

interface Props {
  appType: string;
  onClose: () => void;
  onSuggestionClick?: (label: string) => void;
}


export default function ItiSuggestionPanel({ appType, onSuggestionClick }: Props) {
  const [showAll, setShowAll] = useState(false);

  const suggestions = useMemo(() => {
    const base = suggestionMap[appType] || suggestionMap.default;
    return showAll ? base : base.slice(0, 3); // show only first 3 initially
  }, [appType, showAll]);

  return (
    <div className="bg-zinc-800 text-white p-4 rounded-lg shadow-xl w-[240px] space-y-2">
      {suggestions.map((s, i) => (
        <button
          key={i}
          className="w-full text-left text-sm hover:bg-zinc-700 p-2 rounded"
          onClick={() => onSuggestionClick?.(s)}
        >
          {s}
        </button>
      ))}

      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-indigo-400 text-xs mt-2 hover:underline"
        >
          Show more
        </button>
      )}

      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="text-indigo-400 text-xs mt-2 hover:underline"
        >
          Show less
        </button>
      )}
    </div>
  );
}