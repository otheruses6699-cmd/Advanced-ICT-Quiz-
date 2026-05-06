import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/src/lib/auth";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!roll.trim()) return;

    const success = login(roll.trim());
    if (success) {
      navigate("/");
    } else {
      setError("Invalid Roll Number! Please verify your roll and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-300 text-glow whitespace-nowrap">
            Advanced ICT Quiz
          </h1>
          <p className="text-violet-300 text-lg">Test Your ICT Skills</p>
        </div>

        <div className="bg-violet-900/30 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-8 box-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="roll" className="block text-sm font-medium text-violet-300 mb-2">
                Roll Number
              </label>
              <input
                id="roll"
                type="text"
                placeholder="✨ Enter Roll No (e.g. 25604) ..."
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                className="w-full bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-4 text-white placeholder-violet-500/80 placeholder:italic placeholder:font-sans placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all font-mono text-lg"
                autoComplete="off"
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-pink-500 text-sm mt-3"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={!roll.trim()}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Login / Enter</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-violet-800/50 text-center text-sm text-violet-500">
            <p>Developed by <span className="text-pink-400/80">Abir Hossain Efad</span> &copy; 2026</p>
            <p className="mt-1">Bepza Public School And College, Chittagong</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
