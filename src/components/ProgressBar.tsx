import React from 'react';
import { GameStage } from '../types';
import { Lock, Cake, Brain, Gift, Check } from 'lucide-react';

interface ProgressBarProps {
  currentStage: GameStage;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStage }) => {
  const steps = [
    { id: 'lock', label: 'Lock', icon: Lock, num: 1 },
    { id: 'cake', label: 'Cake', icon: Cake, num: 2 },
    { id: 'quiz', label: 'Quiz', icon: Brain, num: 3 },
    { id: 'victory_gate', label: 'Finale', icon: Gift, num: 4 },
  ];

  const getStageIndex = (stage: GameStage): number => {
    switch (stage) {
      case 'lock':
        return 0;
      case 'cake':
        return 1;
      case 'quiz':
        return 2;
      case 'victory_gate':
      case 'final_wish':
        return 3;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <div className="w-full max-w-md mx-auto mb-6 px-3">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 -z-0" />

        {/* Progress active Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-500 -z-0"
          style={{
            width: `${(currentIndex / (steps.length - 1)) * 88}%`,
          }}
        />

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex || currentStage === 'final_wish';
          const isCurrent = idx === currentIndex && currentStage !== 'final_wish';
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                    : isCurrent
                    ? 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.6)] scale-110'
                    : 'bg-white/5 border border-white/20 text-white/40'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium mt-1.5 transition-colors duration-200 ${
                  isCurrent
                    ? 'text-cyan-300 font-semibold'
                    : isDone
                    ? 'text-emerald-400'
                    : 'text-white/40'
                }`}
              >
                Lvl {step.num}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
