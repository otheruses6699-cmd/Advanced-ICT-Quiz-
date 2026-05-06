export interface User {
  roll: string;
  name: string;
  isAdmin: boolean;
}

export interface Question {
  id: string;
  chapter: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Score {
  id: string;
  roll: string;
  name: string;
  chapter: string;
  score: number;
  total: number;
  date: string;
}

const AUTHORIZED_USERS: User[] = [
  { roll: "25604", name: "Abir Hossain Efad", isAdmin: true },
  { roll: "25606", name: "Muhammad Ishmam", isAdmin: false },
  { roll: "25677", name: "GM.Ayon", isAdmin: false },
  { roll: "25682", name: "Mehedi Hasan", isAdmin: false },
  { roll: "25676", name: "Rudra Dhar", isAdmin: false },
  { roll: "25678", name: "Partha", isAdmin: false },
  { roll: "25610", name: "Shourov", isAdmin: false },
];

const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-1",
    chapter: "Chapter 1: ICT Basics",
    text: "বিশ্বগ্রাম (Global Village) ধারণার প্রবর্তক কে?",
    options: ["মার্শাল ম্যাকলুহান", "টিম বার্নার্স লি", "বিল গেটস", "মার্ক জাকারবার্গ"],
    correctAnswer: 0
  },
  {
    id: "q-2",
    chapter: "Chapter 1: ICT Basics",
    text: "ক্রায়োসার্জারিতে কোন তরল গ্যাস ব্যবহৃত হয়?",
    options: ["তরল অক্সিজেন", "তরল নাইট্রোজেন", "তরল হাইড্রোজেন", "মিথেন"],
    correctAnswer: 1
  },
  {
    id: "q-3",
    chapter: "Chapter 2: Communication Systems",
    text: "ব্লুটুথ নিচের কোন স্ট্যান্ডার্ড মেনে চলে?",
    options: ["IEEE 802.11", "IEEE 802.15", "IEEE 802.16", "IEEE 802.3"],
    correctAnswer: 1
  },
  {
    id: "q-4",
    chapter: "Chapter 3: Number Systems",
    text: "অক্টাল সংখ্যা পদ্ধতির ভিত্তি কত?",
    options: ["২", "৮", "১০", "১৬"],
    correctAnswer: 1
  },
  {
    id: "q-5",
    chapter: "Chapter 4: Web Design & HTML",
    text: "HTML এর পূর্ণরূপ কী?",
    options: ["Hyper Text Markup Language", "High Text Markup Language", "Hyperlink Text Markup Language", "Hyper Tool Markup Language"],
    correctAnswer: 0
  }
];

export const StorageArea = {
  getUsers: (): User[] => {
    const raw = localStorage.getItem("ict_users");
    if (!raw) {
      localStorage.setItem("ict_users", JSON.stringify(AUTHORIZED_USERS));
      return AUTHORIZED_USERS;
    }
    return JSON.parse(raw);
  },
  
  getUserByRoll: (roll: string): User | undefined => {
    return StorageArea.getUsers().find(u => u.roll === roll);
  },

  addUser: (user: User) => {
    const users = StorageArea.getUsers();
    users.push(user);
    localStorage.setItem("ict_users", JSON.stringify(users));
  },

  getQuestions: (): Question[] => {
    const raw = localStorage.getItem("ict_questions");
    if (!raw) {
      localStorage.setItem("ict_questions", JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  },

  addQuestion: (q: Question) => {
    const questions = StorageArea.getQuestions();
    questions.push(q);
    localStorage.setItem("ict_questions", JSON.stringify(questions));
  },

  getChapters: (): string[] => {
    const questions = StorageArea.getQuestions();
    return Array.from(new Set(questions.map(q => q.chapter)));
  },

  getQuestionsByChapter: (chapter: string): Question[] => {
    return StorageArea.getQuestions().filter(q => q.chapter === chapter);
  },

  getScores: (): Score[] => {
    const raw = localStorage.getItem("ict_scores");
    return raw ? JSON.parse(raw) : [];
  },

  saveScore: (score: Score) => {
    const scores = StorageArea.getScores();
    scores.push(score);
    localStorage.setItem("ict_scores", JSON.stringify(scores));
  },

  getLeaderboard: (): Score[] => {
    const scores = StorageArea.getScores();
    return scores.sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime());
  }
};
