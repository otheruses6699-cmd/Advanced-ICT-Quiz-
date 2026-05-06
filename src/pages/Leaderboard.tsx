import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { StorageArea, Score } from "@/src/lib/storage";
import { Trophy, Medal, Award } from "lucide-react";

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    setScores(StorageArea.getLeaderboard());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-pink-500/10 rounded-full mb-4">
          <Trophy className="w-12 h-12 text-pink-400" />
        </div>
        <h1 className="text-4xl font-bold text-white text-glow">Leaderboard</h1>
        <p className="text-violet-300">Top performers across all chapters</p>
      </div>

      <div className="bg-violet-900/30 border border-violet-500/20 rounded-3xl overflow-hidden box-glow p-1">
        {scores.length === 0 ? (
          <div className="p-12 text-center text-violet-400">
            No scores yet. Be the first to take a quiz!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-violet-950/50 text-violet-300 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Chapter</th>
                  <th className="p-4 font-semibold text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-800/30">
                {scores.map((score, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={score.id}
                    className="hover:bg-violet-800/20 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-950 border border-violet-700/50 font-bold text-violet-300">
                        {idx === 0 ? <Trophy className="w-4 h-4 text-yellow-400" /> : 
                         idx === 1 ? <Medal className="w-4 h-4 text-gray-400" /> : 
                         idx === 2 ? <Award className="w-4 h-4 text-amber-600" /> : 
                         idx + 1}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{score.name}</div>
                      <div className="text-xs text-violet-400 font-mono">Roll: {score.roll}</div>
                    </td>
                    <td className="p-4 text-violet-200">
                      {score.chapter}
                      <div className="text-xs opacity-50">{new Date(score.date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 font-bold border border-pink-500/20">
                        {score.score} / {score.total}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
