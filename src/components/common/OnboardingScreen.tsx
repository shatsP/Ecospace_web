import { useState } from "react";
import { motion } from "framer-motion";
import { updateUserMeta } from "../../core/userMetaStore";
import { useNavigate } from "react-router-dom"; // If using react-router

const greetings = [
  "Hello", "Bonjour", "Hola", "Hallo", "Ciao",
  "Namaste", "Konnichiwa", "Hej", "Olá", "안녕하세요"
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<"greeting" | "form">("greeting");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!name || !dob) return;
    updateUserMeta({ name, dob });
    navigate("/"); // Redirect to main desktop or dashboard
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-zinc-900 to-black text-white flex items-center justify-center">
      {step === "greeting" ? (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="text-6xl sm:text-7xl font-extralight tracking-wide">
            {greetings.map((greet, i) => (
              <motion.div
                key={greet}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.3 }}
              >
                {greet}.
              </motion.div>
            ))}
          </div>
          <motion.button
            className="mt-10 px-6 py-2 text-lg rounded bg-white text-black hover:bg-zinc-100 transition"
            onClick={() => setStep("form")}
          >
            Let's get started
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="w-[90%] max-w-md p-8 bg-zinc-800 rounded-xl shadow-lg text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-light mb-6">Tell us about you</h2>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-zinc-700 text-white placeholder-white/50"
          />

          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full p-3 mb-6 rounded bg-zinc-700 text-white"
          />

          <button
            onClick={handleSubmit}
            disabled={!name || !dob}
            className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50"
          >
            Enter Ecospace
          </button>
        </motion.div>
      )}
    </div>
  );
} 
