import React, { useEffect, useRef } from 'react';
import { confettiEngine } from '../utils/confetti';

export const BackgroundParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      confettiEngine.init(canvasRef.current);
    }
    return () => {
      confettiEngine.destroy();
    };
  }, []);

  // Generate 45 randomized ambient twinkling stars
  const stars = React.useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, []);

  return (
    <>
      {/* Deep dark gradient with radial neon glow spots */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#070913]">
        {/* Soft neon ambient spotlights */}
        <div className="absolute -top-[15%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute top-[30%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        <div className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/15 blur-[140px]" />

        {/* Ambient twinkling stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        {/* Subtle grid pattern for high-tech gamified vibe */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* Fullscreen confetti canvas */}
      <canvas
        ref={canvasRef}
        id="confetti-canvas"
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />
    </>
  );
};
