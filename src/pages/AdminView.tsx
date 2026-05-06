import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/src/lib/auth";
import { StorageArea, Question } from "@/src/lib/storage";
import { PlusCircle, Settings, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export default function AdminView() {
  const { user } = useAuth();
  
  const [chapter, setChapter] = useState("");
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");

  const [rollNumber, setRollNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [userSuccessMsg, setUserSuccessMsg] = useState("");

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleOptionChange = (index: number, val: string) => {
    const newOptions = [...options];
    newOptions[index] = val;
    setOptions(newOptions);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim() || !text.trim() || options.some(o => !o.trim())) {
      alert("Please fill all fields");
      return;
    }

    const newQ: Question = {
      id: `q-${Date.now()}`,
      chapter: chapter.trim(),
      text: text.trim(),
      options: options.map(o => o.trim()),
      correctAnswer
    };

    StorageArea.addQuestion(newQ);
    
    // Reset form details (keep chapter to easily add multiple questions)
    setText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(0);
    
    setSuccessMsg("Question added successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !userName.trim()) {
      alert("Please fill all fields");
      return;
    }

    const existingUser = StorageArea.getUserByRoll(rollNumber.trim());
    if (existingUser) {
      alert("Student with this Roll Number already exists!");
      return;
    }

    StorageArea.addUser({
      roll: rollNumber.trim(),
      name: userName.trim(),
      isAdmin: false
    });

    setRollNumber("");
    setUserName("");
    setUserSuccessMsg("Student added successfully!");
    setTimeout(() => setUserSuccessMsg(""), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-pink-400" />
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      </div>

      <div className="bg-violet-900/30 border border-violet-500/20 p-6 sm:p-8 rounded-3xl box-glow">
        <h2 className="text-xl font-semibold text-violet-200 mb-6">Add New Question</h2>

        <form onSubmit={handleAddQuestion} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-violet-300 mb-2">Chapter Name</label>
            <input
              type="text"
              value={chapter}
              onChange={e => setChapter(e.target.value)}
              placeholder="e.g. Chapter 1: ICT Basics"
              className="w-full bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-violet-300 mb-2">Question (Bangla Supported)</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Enter the question text"
              className="w-full bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none h-24 font-bangla"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-violet-300">Options & Correct Answer</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === idx}
                  onChange={() => setCorrectAnswer(idx)}
                  className="w-5 h-5 text-pink-500 bg-violet-900 border-violet-700 focus:ring-pink-500 focus:ring-offset-violet-900"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-2 text-white focus:border-pink-500 focus:outline-none font-bangla"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-violet-800/50 flex items-center justify-between">
            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-400 font-medium"
              >
                <CheckCircle2 className="w-5 h-5" />
                {successMsg}
              </motion.div>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add Question
            </button>
          </div>
        </form>
      </div>

      <div className="bg-violet-900/30 border border-violet-500/20 p-6 sm:p-8 rounded-3xl box-glow">
        <h2 className="text-xl font-semibold text-violet-200 mb-6">Add New Student</h2>

        <form onSubmit={handleAddUser} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
                placeholder="e.g. 25615"
                className="w-full bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-violet-300 mb-2">Student Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="e.g. Rakib"
                className="w-full bg-violet-950/50 border border-violet-700/50 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-violet-800/50 flex items-center justify-between">
            {userSuccessMsg ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-400 font-medium"
              >
                <CheckCircle2 className="w-5 h-5" />
                {userSuccessMsg}
              </motion.div>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
