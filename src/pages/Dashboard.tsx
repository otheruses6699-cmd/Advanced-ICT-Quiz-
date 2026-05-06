import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Search, Play, BookOpen, CalendarHeart } from "lucide-react";
import { StorageArea } from "@/src/lib/storage";
import { useAuth } from "@/src/lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const chapters = StorageArea.getChapters();

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;
    return chapters.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [chapters, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-violet-900/30 border border-violet-500/20 rounded-3xl p-6 sm:p-8 overflow-hidden box-glow"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-violet-500/10 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 text-glow">{user?.name}</span> 👋
          </h1>
          <p className="text-violet-200 text-sm sm:text-base mb-6 max-w-xl leading-relaxed font-sans">
            Level up your ICT expertise. Dive into interactive chapter-wise challenges covering networking, number systems, web design, and beyond.
          </p>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Chapter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-violet-950/50 border border-violet-600/50 rounded-full pl-12 pr-6 py-4 text-white focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>
      </motion.section>

      {/* Daily Quiz Banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-pink-600/20 to-purple-800/20 border border-pink-500/30 rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 box-glow"
      >
        <div className="flex items-center gap-3">
          <div className="bg-pink-500/20 p-3 rounded-full border border-pink-500/40 hidden sm:block">
            <CalendarHeart className="w-6 h-6 text-pink-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-0.5 whitespace-nowrap">Daily Quiz Challenge 📅</h2>
            <p className="text-violet-300 text-xs sm:text-sm">Random questions to test your overall prep.</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/quiz/daily-challenge`)}
          className="flex-shrink-0 bg-pink-600 hover:bg-pink-500 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(236,72,153,0.5)] transform hover:scale-105 text-sm"
        >
          <Play className="w-4 h-4 fill-current" />
          Take Daily Quiz
        </button>
      </motion.section>

      {/* Chapters Grid */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-pink-400 w-6 h-6" />
          <h2 className="text-2xl font-bold text-white">Available Chapters</h2>
        </div>

        {filteredChapters.length === 0 ? (
          <div className="text-center py-12 text-violet-400 bg-violet-900/10 border border-violet-500/10 rounded-2xl">
            No chapters found matching "{searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter, i) => {
              const qs = StorageArea.getQuestionsByChapter(chapter);
              return (
                <motion.div
                  key={chapter}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-violet-950/40 border border-violet-700/30 rounded-2xl p-6 hover:border-pink-500/50 box-glow-hover transition-all flex flex-col h-full"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{chapter}</h3>
                  <p className="text-violet-300 text-sm mb-6 flex-1">
                    {qs.length} Questions Available
                  </p>
                  
                  <button
                    onClick={() => navigate(`/quiz/${encodeURIComponent(chapter)}`)}
                    className="w-full bg-violet-800 hover:bg-pink-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors group"
                  >
                    <span>Start Quiz</span>
                    <Play className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
