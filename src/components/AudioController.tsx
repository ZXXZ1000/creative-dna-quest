import React, { useEffect, useRef, useState } from 'react';
import { assetUrl } from '@/lib/assetUrl';

// Global background music controller with a top-right toggle.
// Default ON; respects autoplay restrictions by resuming on first interaction.
export const AudioController: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState<boolean>(() => {
    try { return localStorage.getItem('bgmMuted') !== '1'; } catch { return true; }
  });
  const [ready, setReady] = useState(false);

  // Initialize audio element once
  useEffect(() => {
    const a = new Audio(assetUrl('Wayfair_Dream_Angel_instrumental_1_50.mp3'));
    a.loop = true;
    a.preload = 'auto';
    a.volume = 0.25;
    audioRef.current = a;
    setReady(true);

    const tryPlay = () => {
      if (!audioRef.current) return;
      if (!enabled) return;
      audioRef.current.play().catch(() => {
        const once = () => {
          audioRef.current!.play().finally(() => {
            window.removeEventListener('pointerdown', once);
            window.removeEventListener('touchstart', once);
          });
        };
        window.addEventListener('pointerdown', once, { once: true });
        window.addEventListener('touchstart', once, { once: true });
      });
    };

    tryPlay();
    return () => {
      try { audioRef.current?.pause(); } catch {}
      audioRef.current = null;
    };
  }, []);

  // React to enabled toggle
  useEffect(() => {
    if (!ready || !audioRef.current) return;
    try {
      if (enabled) {
        localStorage.setItem('bgmMuted', '0');
        audioRef.current.play().catch(() => {/* user gesture needed */});
      } else {
        localStorage.setItem('bgmMuted', '1');
        audioRef.current.pause();
      }
    } catch {}
  }, [enabled, ready]);

  return (
    <button
      aria-label={enabled ? 'Mute background music' : 'Unmute background music'}
      onClick={() => setEnabled((v) => !v)}
      className="absolute z-[60] m-3 p-0 bg-transparent shadow-none hover:bg-transparent"
      style={{
        right: 'calc(8px * var(--responsive-scale))',
        bottom: 'calc(8px * var(--responsive-scale))'
      }}
    >
      {/* Speaker icon only (no background) */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 9v6h4l5 4V5L7 9H3z" fill="#111"/>
        {enabled ? (
          <>
            <path d="M16 8a5 5 0 010 8" stroke="#111" strokeWidth="2" fill="none"/>
            <path d="M18.5 5.5a8.5 8.5 0 010 13" stroke="#111" strokeWidth="2" fill="none"/>
          </>
        ) : (
          <path d="M19 5L5 19" stroke="#111" strokeWidth="2"/>
        )}
      </svg>
    </button>
  );
};
