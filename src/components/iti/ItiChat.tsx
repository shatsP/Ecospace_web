import React, { useState, useEffect } from "react";
import { useAppStore } from "../../core/StateStore";
import { motion, AnimatePresence } from "framer-motion";

const ItiChat: React.FC = () => {
  const itiChatOpen = useAppStore((state) => state.itiChatOpen);
  const messages = useAppStore((state) => state.itiMessages);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.sender === "user") {
      setShowTyping(true);
      const t = setTimeout(() => setShowTyping(false), 1500);
      return () => clearTimeout(t);
    }
  }, [messages]);

  if (!itiChatOpen) return null;

  return (
    <div className="fixed bottom-24 w-[600px] max-w-full px-4 z-40">
      <div className="transition-all duration-300 ease-in-out border border-zinc-700 backdrop-blur-lg shadow-lg rounded-3xl bg-zinc-800/80 p-4 space-y-2 overflow-hidden">
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`text-sm px-4 py-2 rounded-2xl max-w-[75%] ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white self-end ml-auto shadow"
                    : "bg-zinc-900 text-zinc-200 self-start mr-auto"
                }`}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {showTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="self-start mr-auto bg-zinc-900 text-white px-4 py-2 rounded-4xl text-sm flex gap-1"
            >
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};


export default ItiChat;
