import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ClockOverlay({
  position = "bottom-left",
  onClick,
}: {
position?: "center" | "bottom-left" | "top-left" | "top-center";
  onClick?: () => void;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = format(now, "HH:mm:ss");
  const dateString = format(now, "EEEE, MMMM d");

const positionClasses =
  position === "center"
    ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    : position === "top-center"
    ? "top-6 left-1/2 -translate-x-1/2"
    : "left-6 bottom-6";


  return (
    <motion.div
      onClick={onClick}
      className={`fixed ${positionClasses} z-30 cursor-pointer select-none px-4 py-2 rounded-xl backdrop-blur-md bg-zinc-900/30 text-white transition-opacity duration-300`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-4xl sm:text-6xl font-extralight text-white/90 leading-tight font-[Inter,JetBrains_Mono,Satoshi,sans-serif]">
        {timeString}
      </div>
      <div className="text-sm font-light text-white/50 mt-1">
        {dateString}
      </div>
    </motion.div>
  );
}
