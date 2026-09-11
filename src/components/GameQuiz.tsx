import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Brain, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';
import { soundManager } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

interface GameQuizProps {
  onSuccess: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Birthday pe sabse important kya hai?',
    options: [
      { id: '1a', text: 'Homework', isCorrect: false, reaction: 'Serious ho kya?! Birthday pe homework kaun karta hai 😂' },
      { id: '1b', text: 'Cake 🎂', isCorrect: true, reaction: 'Bilkul sahi! No cake, no entry! 🎂🎉' },
      { id: '1c', text: 'Attendance', isCorrect: false, reaction: '75% criteria abhi bhool jao! 💀' },
      { id: '1d', text: 'Alarm clock', isCorrect: false, reaction: 'Aaj alarm band karke chain se sone ka din hai! 😴' },
    ],
    correctNote: 'Cake is mandatory! Full priorities sorted 😂',
  },
  {
    id: 2,
    question: 'Anita ka birthday mood?',
    options: [
      { id: '2a', text: '😴 (Sona hai bas)', isCorrect: false, reaction: 'Arre utho Anita, birthday hai tumhara! 😂' },
      { id: '2b', text: '😐 (Normal day)', isCorrect: false, reaction: 'Itna dry reaction nahi chalega! 😜' },
      { id: '2c', text: '🥳 (Party mode on)', isCorrect: true, reaction: 'Sahi pakde hain! Full party & celebration vibes only! 🥳✨' },
      { id: '2d', text: '😡 (Kisine late wish kiya)', isCorrect: false, reaction: 'Gussa mat karo, cake thanda ho jayega 😂' },
    ],
    correctNote: 'Party mode 🥳 is the only acceptable option today!',
  },
  {
    id: 3,
    question: 'Treat kab mil rahi hai Anita? 😂',
    options: [
      { id: '3a', text: 'Kal pakka (jo kabhi nahi aata)', isCorrect: false, reaction: 'Aaye haaye, typical scam scheme detected! 🤣' },
      { id: '3b', text: 'Abhi ke abhi! 🍰🥳', isCorrect: true, reaction: 'Yeh hui na baat! Virtual momos & cake ready karo! 🥟🎂' },
      { id: '3c', text: 'Agle saal sochte hain', isCorrect: false, reaction: 'Agle saal tak wait kaun karega bhai 😂' },
      { id: '3d', text: 'Nepal aake treat lo 🇳🇵✈️', isCorrect: true, reaction: 'Nepal trip confirm! Everest view with birthday momos! 🏔️🥟' },
    ],
    correctNote: 'Treat secured! Ab birthday message ka time aa gaya hai! 🎁',
  },
];

export const GameQuiz: React.FC<GameQuizProps> = ({ onSuccess }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (optId: string) => {
    if (isAdvancing) return;

    const opt = currentQ.options.find((o) => o.id === optId);
    if (!opt) return;

    setSelectedOptId(optId);

    if (opt.isCorrect) {
      soundManager.playQuizCorrect();
      confettiEngine.burst(40);
      setFeedback({ isCorrect: true, message: opt.reaction });
      setIsAdvancing(true);

      setTimeout(() => {
        if (currentIdx < QUIZ_QUESTIONS.length - 1) {
          setCurrentIdx((idx) => idx + 1);
          setSelectedOptId(null);
          setFeedback(null);
          setIsAdvancing(false);
        } else {
          // All questions cleared!
          soundManager.playUnlock();
          onSuccess();
        }
      }, 1500);
    } else {
      soundManager.playQuizWrong();
      setFeedback({ isCorrect: false, message: opt.reaction });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>GAME 3 — Quick Quiz</span>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span>Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            {currentQ.question}
          </h2>
        </div>

        {/* Question Progress Dots */}
        <div className="flex justify-center gap-2 mb-5">
          {QUIZ_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? 'w-8 bg-amber-400'
                  : i < currentIdx
                  ? 'w-4 bg-emerald-400'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptId === opt.id;
            const isCorrect = opt.isCorrect;
            const showSuccess = isSelected && isCorrect;
            const showError = isSelected && !isCorrect;

            return (
              <button
                key={opt.id}
                id={`quiz-option-${opt.id}`}
                type="button"
                disabled={isAdvancing}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer select-none ${
                  showSuccess
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                    : showError
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-shake'
                    : 'bg-white/[0.04] hover:bg-white/[0.09] active:bg-white/[0.12] border-white/10 text-slate-200 hover:border-amber-400/40'
                } disabled:cursor-default`}
              >
                <span className="font-semibold text-sm sm:text-base">{opt.text}</span>
                {showSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                ) : showError ? (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        <div className="min-h-[44px]">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback.message}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-2.5 rounded-xl text-xs sm:text-sm font-medium ${
                  feedback.isCorrect
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                }`}
              >
                {feedback.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Skip or Next Helper if needed */}
        {isAdvancing && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-300">
            <span>Next question coming up</span>
            <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
          </div>
        )}
      </div>
    </motion.div>
  );
};
