// src/components/iti/orb/ItiMiniBar.tsx
import React, { useState } from "react";
import { handleItiInput } from "../../../iti/ItiEngine";
import { getLLMFallbackResponse } from "../../../llm/fallbackLLM";

type ItiMiniBarProps = {
  onTyping: () => void;
  onMessageSubmit: (message: string, reply: string) => void;
};

const ItiMiniBar: React.FC<ItiMiniBarProps> = ({ onTyping, onMessageSubmit }) => {
  const [input, setInput] = useState("");

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
        const userText = input;
        const result = handleItiInput(userText);
        onTyping();
        setInput("");

        if (result.intent?.startsWith("launch_")) {
        const intent = result.intent.replace("launch_", "");
        window.ecospace?.launchByIntent?.(intent, userText);
        }

        if (!result.intent || result.intent === "unknown") {
        const fallback = await getLLMFallbackResponse(userText);
        const reply = fallback || "Sorry, I’m not sure yet.";
        onMessageSubmit(userText, reply);
        } else {
        const reply = `Let me handle: ${result.intent}`;
        onMessageSubmit(userText, reply);
        }
    }
    };

  return (
    <div className="rounded-xl bg-zinc-800/80 border border-zinc-700 px-3 py-2 shadow-lg w-[240px]">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Talk to Iti..."
        className="w-full bg-transparent text-sm outline-none text-white placeholder-zinc-400"
      />
    </div>
  );
};

export default ItiMiniBar;
