import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Delete, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

interface GameLockProps {
  onSuccess: () => void;
}

export const GameLock: React.FC<GameLockProps> = ({ onSuccess }) => {
  const [code, setCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  const handleDigit = (digit: string) => {
    if (code.length >= 4 || isUnlocked) return;
    soundManager.playKeyClick();
    const newCode = code + digit;
    setCode(newCode);
    setErrorMsg(null);

    if (newCode.length === 4) {
      validateCode(newCode);
    }
  };

  const handleDelete = () => {
    if (code.length > 0 && !isUnlocked) {
      soundManager.playKeyClick();
      setCode(code.slice(0, -1));
      setErrorMsg(null);
    }
  };

  const handleClear = () => {
    if (!isUnlocked) {
      soundManager.playKeyClick();
      setCode('');
      setErrorMsg(null);
    }
  };

  const validateCode = (entered: string) => {
    // Valid codes:
    // 0911 (September 11), 1109, 0909, 0009, 2026, or any starting with 09 (month September)
    const isValid =
      entered === '0911' ||
      entered === '1109' ||
      entered === '0909' ||
      entered === '0009' ||
      entered === '2026' ||
      entered.startsWith('09');

    if (isValid) {
      setIsUnlocked(true);
      soundManager.playUnlock();
      confettiEngine.burst(50);
      setTimeout(() => {
        onSuccess();
      }, 1600);
    } else {
      setAttemptCount((prev) => prev + 1);
      soundManager.playError();
      setErrorMsg('Arre yaar 😂 try again!');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setCode('');
      }, 700);
    }
  };

  // Listen to physical keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocked) return;
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isUnlocked]);

  const useBypass = () => {
    soundManager.playKeyClick();
    setCode('0911');
    validateCode('0911');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header dialogue as requested */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>GAME 1 — Birthday Lock</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            Hey Anita <span className="inline-block animate-bounce">👀</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            Birthday message directly nahi milega…
            <br />
            <span className="text-cyan-300 font-medium">pehle thoda game khelna padega 😂</span>
          </p>
        </div>

        {/* Lock Graphic */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={
              isUnlocked
                ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }
                : isShaking
                ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                : {}
            }
            transition={{ duration: 0.5 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
              isUnlocked
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                : isShaking
                ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.5)]'
                : 'bg-slate-800/80 border-cyan-500/30 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            }`}
          >
            {isUnlocked ? (
              <Unlock className="w-8 h-8 text-emerald-400" />
            ) : (
              <Lock className="w-8 h-8 text-cyan-400" />
            )}
          </motion.div>
        </div>

        {/* 4 Digit Display Cells */}
        <div className="flex justify-center items-center gap-3 mb-4">
          {[0, 1, 2, 3].map((index) => {
            const digit = code[index];
            const isFilled = digit !== undefined;

            return (
              <motion.div
                key={index}
                animate={isShaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-200 border ${
                  isUnlocked
                    ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                    : isFilled
                    ? 'border-cyan-400/80 bg-cyan-950/40 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'border-white/10 bg-white/[0.03] text-white/20'
                }`}
              >
                {isFilled ? (isUnlocked ? digit : '●') : ''}
              </motion.div>
            );
          })}
        </div>

        {/* Error / Feedback Message */}
        <div className="min-h-[28px] mb-4">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.p
                key="err"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-rose-400 text-sm font-semibold tracking-wide"
              >
                {errorMsg}
              </motion.p>
            )}
            {isUnlocked && (
              <motion.p
                key="succ"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-400 text-sm font-bold tracking-wide flex items-center justify-center gap-1.5"
              >
                <span>Code Unlocked! Next level loading...</span>
                <ArrowRight className="w-4 h-4 animate-pulse" />
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Hint Box */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              setShowHint(!showHint);
              soundManager.playKeyClick();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint: “Birthday month yaad hai? 😏”</span>
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-slate-300 bg-white/5 border border-cyan-500/20 rounded-xl p-2.5 max-w-xs mx-auto"
              >
                <span>September month is <b>09</b>! Try <b>0911</b> or <b>0909</b> 👀</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Master Key Bypass if Anita failed twice */}
          {attemptCount >= 2 && !isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3"
            >
              <button
                type="button"
                onClick={useBypass}
                className="text-xs text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full transition-all"
              >
                Anita shortcut: Click here to enter 0911 🗝️
              </button>
            </motion.div>
          )}
        </div>

        {/* Digital Numpad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
            <button
              key={d}
              id={`numpad-${d}`}
              type="button"
              disabled={isUnlocked}
              onClick={() => handleDigit(d)}
              className="h-12 rounded-xl bg-white/[0.05] hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-white/10 hover:border-cyan-400/40 text-white font-semibold text-lg transition-all duration-150 flex items-center justify-center select-none shadow-sm cursor-pointer disabled:opacity-50"
            >
              {d}
            </button>
          ))}

          {/* Clear */}
          <button
            type="button"
            id="numpad-clear"
            disabled={isUnlocked}
            onClick={handleClear}
            className="h-12 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/30 text-xs font-semibold text-slate-300 transition-all duration-150 flex items-center justify-center select-none cursor-pointer disabled:opacity-50"
          >
            CLEAR
          </button>

          {/* Zero */}
          <button
            type="button"
            id="numpad-0"
            disabled={isUnlocked}
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl bg-white/[0.05] hover:bg-cyan-500/20 active:bg-cyan-500/30 border border-white/10 hover:border-cyan-400/40 text-white font-semibold text-lg transition-all duration-150 flex items-center justify-center select-none shadow-sm cursor-pointer disabled:opacity-50"
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            id="numpad-backspace"
            disabled={isUnlocked}
            onClick={handleDelete}
            className="h-12 rounded-xl bg-white/[0.03] hover:bg-slate-700/40 border border-white/10 hover:border-cyan-400/30 text-slate-300 transition-all duration-150 flex items-center justify-center select-none cursor-pointer disabled:opacity-50"
            aria-label="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
