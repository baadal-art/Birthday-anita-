import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const SoundToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggle = () => {
    const newState = soundManager.toggleMute();
    setIsMuted(newState);
    if (!newState) {
      soundManager.playKeyClick();
    }
  };

  return (
    <button
      id="sound-toggle-btn"
      onClick={handleToggle}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 backdrop-blur-md border ${
        isMuted
          ? 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
          : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
      }`}
      title={isMuted ? 'Unmute audio' : 'Mute audio'}
      aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-red-400" />
          <span>Sound OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Sound ON</span>
        </>
      )}
    </button>
  );
};
