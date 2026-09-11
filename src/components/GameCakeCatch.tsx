import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Timer, RotateCcw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';

interface GameCakeCatchProps {
  onSuccess: () => void;
}

interface FallingCake {
  id: number;
  x: number; // percentage 5% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
  caught: boolean;
  emoji: string;
}

export const GameCakeCatch: React.FC<GameCakeCatchProps> = ({ onSuccess }) => {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [basketX, setBasketX] = useState<number>(50); // percentage 5% to 95%
  const [cakes, setCakes] = useState<FallingCake[]>([]);
  const [popups, setPopups] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const nextCakeId = useRef<number>(1);
  const animFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  // Start game
  const startGame = () => {
    soundManager.playKeyClick();
    setScore(0);
    setTimeLeft(20);
    setCakes([]);
    setPopups([]);
    setBasketX(50);
    setGameState('playing');
    lastSpawnRef.current = performance.now();
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check win / lose condition based on time and score
  useEffect(() => {
    if (gameState === 'playing') {
      if (score >= 10) {
        setGameState('won');
        soundManager.playUnlock();
        confettiEngine.burst(80);
      } else if (timeLeft <= 0) {
        setGameState('lost');
        soundManager.playError();
      }
    }
  }, [score, timeLeft, gameState]);

  // Keyboard controls (Arrow keys & A/D)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBasketX((prev) => Math.max(8, prev - 7));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBasketX((prev) => Math.min(92, prev + 7));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch & Mouse movement
  const handlePointerMove = (clientX: number) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, relativeX)));
  };

  // Main game animation loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastTime = performance.now();

    const updateGame = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Spawn new cakes every 800ms
      if (currentTime - lastSpawnRef.current > 750) {
        lastSpawnRef.current = currentTime;
        const cakeEmojis = ['🎂', '🍰', '🧁', '🎂', '🎂'];
        setCakes((prev) => [
          ...prev,
          {
            id: nextCakeId.current++,
            x: 8 + Math.random() * 84,
            y: 0,
            speed: 38 + Math.random() * 20, // percentage per second
            caught: false,
            emoji: cakeEmojis[Math.floor(Math.random() * cakeEmojis.length)],
          },
        ]);
      }

      // Update cake positions & check collision
      setCakes((prevCakes) => {
        const nextList: FallingCake[] = [];

        for (const cake of prevCakes) {
          if (cake.caught) continue;

          const newY = cake.y + cake.speed * delta;

          // Basket collision zone: Y between 80% and 90%
          const inYRange = newY >= 78 && newY <= 90;
          const inXRange = Math.abs(cake.x - basketX) < 13;

          if (inYRange && inXRange) {
            // Cake caught!
            soundManager.playCatchCake();
            setScore((s) => Math.min(10, s + 1));

            // Floating popup
            setPopups((p) => [
              ...p,
              {
                id: Math.random(),
                x: basketX,
                y: 80,
                text: '+1 🎂',
              },
            ]);

            continue; // don't push into nextList
          }

          // If fell past bottom
          if (newY < 96) {
            nextList.push({ ...cake, y: newY });
          }
        }

        return nextList;
      });

      animFrameRef.current = requestAnimationFrame(updateGame);
    };

    animFrameRef.current = requestAnimationFrame(updateGame);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, basketX]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-3xl p-5 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-semibold tracking-wider uppercase mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>GAME 2 — Catch the Cake</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Catch Anita&apos;s Birthday Cakes! 🎂
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Goal: Catch <span className="text-fuchsia-300 font-semibold">10 cakes</span> in{' '}
            <span className="text-cyan-300 font-semibold">20 seconds</span>
          </p>
        </div>

        {/* HUD: Score and Timer */}
        <div className="flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2.5 mb-4">
          <div className="text-left">
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Score
            </span>
            <div className="text-lg font-extrabold text-fuchsia-300">
              {score} <span className="text-xs text-slate-400 font-normal">/ 10</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 rounded-full"
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-right flex items-center gap-1.5">
            <Timer
              className={`w-4 h-4 ${
                timeLeft <= 5 ? 'text-rose-400 animate-ping' : 'text-cyan-400'
              }`}
            />
            <div>
              <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
                Time
              </span>
              <span
                className={`text-lg font-extrabold ${
                  timeLeft <= 5 ? 'text-rose-400 font-black' : 'text-cyan-300'
                }`}
              >
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Main Interactive Game Canvas Container */}
        <div
          ref={containerRef}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              handlePointerMove(e.touches[0].clientX);
            }
          }}
          className="relative w-full h-[280px] sm:h-[320px] rounded-2xl bg-slate-950/70 border border-white/10 overflow-hidden select-none touch-none cursor-ew-resize"
        >
          {/* Subtle grid lines in arena */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to bottom, transparent 95%, rgba(255,255,255,0.4) 95%)',
              backgroundSize: '100% 30px',
            }}
          />

          {/* Falling Cakes */}
          {cakes.map((cake) => (
            <div
              key={cake.id}
              className="absolute text-2xl sm:text-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
              style={{
                left: `${cake.x}%`,
                top: `${cake.y}%`,
              }}
            >
              {cake.emoji}
            </div>
          ))}

          {/* Floating +1 popups */}
          {popups.map((popup) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -30, scale: 1.3 }}
              transition={{ duration: 0.6 }}
              className="absolute pointer-events-none text-emerald-300 font-extrabold text-sm -translate-x-1/2 drop-shadow"
              style={{
                left: `${popup.x}%`,
                top: `${popup.y}%`,
              }}
            >
              {popup.text}
            </motion.div>
          ))}

          {/* Player Basket */}
          <div
            className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{ left: `${basketX}%` }}
          >
            <div className="px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-400/60 rounded-xl shadow-[0_0_18px_rgba(217,70,239,0.5)] flex items-center gap-1">
              <span className="text-xl">🧺</span>
              <span className="text-[10px] font-bold text-fuchsia-200 tracking-wider">ANITA</span>
            </div>
          </div>

          {/* Overlay for Ready State */}
          {gameState === 'ready' && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
              <div className="text-4xl mb-2 animate-bounce">🎂</div>
              <h3 className="text-lg font-bold text-white mb-1">Catch 10 Birthday Cakes!</h3>
              <p className="text-xs text-slate-300 max-w-xs mb-4">
                Drag on screen, use Arrow Keys (← / →), or tap buttons below to move the basket!
              </p>
              <button
                type="button"
                id="start-cake-game"
                onClick={startGame}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Start Game 🚀
              </button>
            </div>
          )}

          {/* Overlay for Game Over (Time out) */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-20">
              <div className="text-3xl mb-2">😢🎂</div>
              <h3 className="text-lg font-bold text-rose-400 mb-1">Time khatam! 😂</h3>
              <p className="text-xs text-slate-300 max-w-xs mb-4">
                Cake gir gaye sab! You caught {score}/10 cakes. Anita deserves all 10 cakes!
              </p>
              <button
                type="button"
                id="retry-cake-game"
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-white/20 text-white font-semibold text-sm hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>Try Again 🔄</span>
              </button>
            </div>
          )}

          {/* Overlay for Win */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-5 z-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl mb-2"
              >
                🎂✨
              </motion.div>
              <h3 className="text-xl font-bold text-emerald-400 mb-1">Cake secured! 🎂</h3>
              <p className="text-sm text-slate-200 mb-5 font-medium">
                Ab birthday wish unlock hone wali hai 👀
              </p>
              <button
                type="button"
                id="cake-game-next-btn"
                onClick={() => {
                  soundManager.playKeyClick();
                  onSuccess();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <span>Go to Game 3 🧠</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile-Friendly Left/Right Controls for Easy Touch Play */}
        {gameState === 'playing' && (
          <div className="flex items-center justify-between gap-3 mt-3">
            <button
              type="button"
              id="basket-move-left"
              onClick={() => setBasketX((prev) => Math.max(8, prev - 12))}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-cyan-500/20 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 select-none"
            >
              <ChevronLeft className="w-4 h-4 text-cyan-400" />
              <span>Left</span>
            </button>
            <div className="text-[11px] text-slate-400">Swipe or Tap</div>
            <button
              type="button"
              id="basket-move-right"
              onClick={() => setBasketX((prev) => Math.min(92, prev + 12))}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-cyan-500/20 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 select-none"
            >
              <span>Right</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
