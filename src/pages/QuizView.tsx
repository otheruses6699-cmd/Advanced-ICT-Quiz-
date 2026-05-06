import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StorageArea, Question } from "@/src/lib/storage";
import { useAuth } from "@/src/lib/auth";
import { Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

export default function QuizView() {
  const { chapter } = useParams<{ chapter: string }>();
  const decodedChapter = decodeURIComponent(chapter || "");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(3000); // 50 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!decodedChapter) return;
    
    let qList: Question[] = [];
    
    if (decodedChapter === "daily-challenge") {
      // Pick randomly up to 20 questions
      const allQ = StorageArea.getQuestions();
      const shuffled = [...allQ].sort(() => 0.5 - Math.random());
      qList = shuffled.slice(0, 20);
    } else {
      qList = StorageArea.getQuestionsByChapter(decodedChapter).slice(0, 50);
    }
    
    setQuestions(qList);
    setTimeLeft(qList.length * 60); // 1 minute per question
  }, [decodedChapter]);

  // Timer logic
  useEffect(() => {
    if (submitted || questions.length === 0) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerInt = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerInt);
  }, [timeLeft, submitted, questions.length]);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    let currentScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) currentScore++;
    });
    
    setScore(currentScore);
    setSubmitted(true);

    if (user) {
      StorageArea.saveScore({
        id: `score-${Date.now()}`,
        roll: user.roll,
        name: user.name,
        chapter: decodedChapter === "daily-challenge" ? "Daily Challenge" : decodedChapter,
        score: currentScore,
        total: questions.length,
        date: new Date().toISOString()
      });
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-20 text-violet-300">
        <h2 className="text-2xl font-bold mb-4">No questions available</h2>
        <button onClick={() => navigate("/")} className="text-pink-400 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header / Sticky Progress */}
      <div className="sticky top-24 z-40 bg-violet-950/80 backdrop-blur-md border border-violet-800/50 rounded-xl p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white">
            {decodedChapter === "daily-challenge" ? "Daily Challenge" : decodedChapter}
          </h1>
          <p className="text-xs text-violet-300">
            {submitted ? "Quiz Completed" : `${Object.keys(answers).length} / ${questions.length} Answered`}
          </p>
        </div>
        
        {!submitted && (
          <div className="flex items-center gap-1.5 bg-violet-900/50 px-3 py-1.5 rounded-full border border-violet-700/50">
            <Clock className={cn("w-4 h-4", timeLeft < 300 ? "text-red-400 animate-pulse" : "text-pink-400")} />
            <span className={cn("font-mono font-bold text-base", timeLeft < 300 ? "text-red-400" : "text-white")}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Render Result Summary if Submitted */}
      {submitted && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-violet-900/30 border border-pink-500/30 rounded-3xl p-8 text-center box-glow"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Results</h2>
          <p className="text-violet-300 mb-6">Here is how you performed, {user?.name}</p>
          
          <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-pink-500 bg-violet-950/50 mb-8 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <span className="text-4xl font-bold text-pink-400">{score}</span>
            <span className="text-violet-400 text-sm">out of {questions.length}</span>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-800 hover:bg-violet-700 text-white transition">
              <ArrowLeft className="w-5 h-5" /> Dashboard
            </button>
            <button onClick={() => navigate("/leaderboard")} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-pink-500/50 hover:bg-pink-500/10 text-pink-400 transition box-glow-hover">
              Leaderboard
            </button>
          </div>
        </motion.div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const isAnswered = answers[qIdx] !== undefined;
          const selectedOp = answers[qIdx];
          
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="bg-violet-950/40 border border-violet-800/40 rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">
                  {qIdx + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-medium text-white font-bangla pt-1">
                  {q.text}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedOp === oIdx;
                  const isCorrectAnswer = q.correctAnswer === oIdx;
                  
                  // Compute styling based on submission state
                  let btnClass = "border-violet-700/50 bg-violet-900/20 hover:border-pink-500/50 hover:bg-violet-800/40 text-violet-200";
                  
                  if (submitted) {
                    if (isCorrectAnswer) {
                      btnClass = "border-green-500 bg-green-500/20 text-green-100";
                    } else if (isSelected && !isCorrectAnswer) {
                      btnClass = "border-red-500 bg-red-500/20 text-red-100";
                    } else {
                      btnClass = "border-violet-800/20 bg-violet-950/20 text-violet-500 opacity-50";
                    }
                  } else if (isSelected) {
                    btnClass = "border-pink-500 bg-pink-500/20 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      className={cn(
                        "text-left p-4 rounded-xl border transition-all flex items-center justify-between font-bangla",
                        btnClass
                      )}
                    >
                      <span className="text-[1.05rem]">{opt}</span>
                      {submitted && isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                      {submitted && isSelected && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2.5 px-8 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transition-all flex items-center gap-2 transform hover:scale-105"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-base">Submit Final Answers</span>
          </button>
        </div>
      )}
    </div>
  );
}
