// src/components/iti/orb/ItiMiniChat.tsx
import React, { useEffect, useRef } from "react";

type Message = {
  sender: "user" | "iti";
  text: string;
};

type ItiMiniChatProps = {
  messages: Message[];
  onClose?: () => void;
};

const ItiMiniChat: React.FC<ItiMiniChatProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-[240px] h-[200px] bg-zinc-900 rounded-xl shadow-xl text-white flex flex-col overflow-hidden border border-zinc-700">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-2 py-1 space-y-1 text-xs"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded ${
              msg.sender === "user"
                ? "bg-zinc-700 text-right ml-auto max-w-[85%]"
                : "bg-indigo-600 text-left mr-auto max-w-[85%]"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItiMiniChat;
