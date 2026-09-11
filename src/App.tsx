import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { GameStage } from './types';
import { BackgroundParticles } from './components/BackgroundParticles';
import { SoundToggle } from './components/SoundToggle';
import { ProgressBar } from './components/ProgressBar';
import { GameLock } from './components/GameLock';
import { GameCakeCatch } from './components/GameCakeCatch';
import { GameQuiz } from './components/GameQuiz';
import { FinalWish } from './components/FinalWish';
import { Sparkles, Gamepad2 } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<GameStage>('lock');

  const handleReplay = () => {
    setStage('lock');
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Starfield, Ambient Neon Lights & Fullscreen Confetti Canvas */}
      <BackgroundParticles />

      {/* Top Navigation Bar */}
      <header className="w-full max-w-4xl mx-auto px-4 pt-4 sm:pt-6 pb-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                Anita&apos;s Quest
              </span>
              <span className="text-sm">🇳🇵</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 block -mt-0.5">
              Birthday Adventure Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <SoundToggle />
        </div>
      </header>

      {/* Main Interactive Stage Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 w-full max-w-3xl mx-auto">
        {/* Stage Progress Tracker */}
        <ProgressBar currentStage={stage} />

        {/* Dynamic Game Component based on Stage */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {stage === 'lock' && (
              <GameLock
                key="stage-lock"
                onSuccess={() => setStage('cake')}
              />
            )}

            {stage === 'cake' && (
              <GameCakeCatch
                key="stage-cake"
                onSuccess={() => setStage('quiz')}
              />
            )}

            {stage === 'quiz' && (
              <GameQuiz
                key="stage-quiz"
                onSuccess={() => setStage('victory_gate')}
              />
            )}

            {(stage === 'victory_gate' || stage === 'final_wish') && (
              <FinalWish
                key="stage-final"
                onReplay={handleReplay}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-center text-xs text-slate-500 z-10">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
          <span>Interactive Birthday Mini Game for Anita • Nepal 🇳🇵</span>
        </div>
      </footer>
    </div>
  );
}
