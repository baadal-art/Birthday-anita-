import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Gift, RotateCcw, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

interface FinalWishProps {
  onReplay: () => void;
}

export const FinalWish: React.FC<FinalWishProps> = ({ onReplay }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const handleUnlock = () => {
    soundManager.playVictoryFanfare();
    confettiEngine.grandFinale();
    setIsUnlocked(true);
  };

  const handleMoreConfetti = () => {
    soundManager.playCatchCake();
    confettiEngine.burst(80);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* LEVEL COMPLETE GATE */
          <motion.div
            key="gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-xl bg-slate-900/65 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)]">
              <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              LEVEL COMPLETE 🏆
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xs mx-auto leading-relaxed">
              Lock tod diya, cakes catch kar liye, aur quiz bhi crack kar diya!
              <br />
              <span className="text-amber-300 font-semibold">Ab aakhri surprise ready hai...</span>
            </p>

            <button
              type="button"
              id="unlock-birthday-msg-btn"
              onClick={handleUnlock}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-fuchsia-500 text-white font-bold text-base shadow-[0_0_30px_rgba(244,63,94,0.45)] hover:shadow-[0_0_40px_rgba(244,63,94,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              <span>Unlock Birthday Message 🎁</span>
            </button>
          </motion.div>
        ) : (
          /* FINAL BIRTHDAY MESSAGE CARD */
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="backdrop-blur-2xl bg-slate-900/75 border border-white/15 rounded-3xl p-6 sm:p-9 shadow-[0_12px_40px_0_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            {/* Top ambient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-400/40 text-fuchsia-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>Special Delivery 🇳🇵</span>
              </div>

              <span className="text-xs text-slate-400 font-mono">100% UNLOCKED</span>
            </div>

            {/* Main Greeting Heading */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-5">
              Happy Birthday, Anita! 🎂🥳
            </h1>

            {/* Birthday Message Body - EXACT User Specified Words */}
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
              <p className="font-medium text-amber-300">
                Ek aur saal successfully complete 😂
              </p>

              <p className="text-slate-300">
                Kaafi random tha ki Instagram ke ek comment section se humari baat start hui… internet kabhi-kabhi unexpected kaam kar deta hai 😂
              </p>

              <p className="text-slate-300">
                Anyway, hope tumhara aane wala year achha rahe, naye experiences laaye aur jo bhi plans hain unmein progress hoti rahe.
              </p>

              <p className="text-slate-300">
                Aaj bas chill karo, cake khao aur birthday enjoy karo. 😌🎂
              </p>

              <p className="text-lg font-bold text-white pt-2 border-t border-white/10 flex items-center gap-2">
                <span>Once again, Happy Birthday Anita! 🥳🇳🇵</span>
              </p>
            </div>

            {/* Interactive Extras: Confetti burst & Replay */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                id="more-confetti-btn"
                onClick={handleMoreConfetti}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <span>Party Confetti 🎉</span>
              </button>

              <button
                type="button"
                id="replay-game-btn"
                onClick={() => {
                  soundManager.playKeyClick();
                  onReplay();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Game 🔄</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
