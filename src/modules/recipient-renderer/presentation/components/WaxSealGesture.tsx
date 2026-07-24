'use client';

import React, { useState, useRef } from 'react';
import type { ColorTokens, GestureTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface GestureComponentProps {
  gesture: GestureTokens & { instructions?: string };
  colors: ColorTokens;
  onProgress?: (progress: number) => void;
  onComplete: () => void;
}

export const WaxSealGesture: React.FC<GestureComponentProps> = ({ gesture, colors, onProgress, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    setIsHolding(true);
    let current = progress;
    timerRef.current = setInterval(() => {
      current += 4;
      if (current >= 100) {
        clearInterval(timerRef.current!);
        setProgress(100);
        setIsHolding(false);
        if (onProgress) onProgress(100);
        onComplete();
      } else {
        setProgress(current);
        if (onProgress) onProgress(current);
      }
    }, 40);
  };

  const endHold = () => {
    setIsHolding(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (progress < 100) {
      // Decay back to 0 softly
      const decayTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(decayTimer);
            return 0;
          }
          const next = prev - 8;
          if (onProgress) onProgress(Math.max(0, next));
          return Math.max(0, next);
        });
      }, 30);
    }
  };

  const strokeDashoffset = 283 - (283 * progress) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', userSelect: 'none' }}>
      <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glowing Progress SVG Ring */}
        <svg width="130" height="130" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle
            cx="65"
            cy="65"
            r="45"
            stroke={colors.borderGlass}
            strokeWidth="4"
            fill="none"
          />
          <circle
            cx="65"
            cy="65"
            r="45"
            stroke={colors.accentGlow}
            strokeWidth="5"
            fill="none"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: isHolding ? 'stroke-dashoffset 0.05s linear' : 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>

        {/* Central Wax Seal Emblem Button */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: `2px solid ${colors.accentGlow}`,
            background: isHolding
              ? `radial-gradient(circle, ${colors.accentGlow} 0%, ${colors.surfaceGlass} 100%)`
              : colors.surfaceGlass,
            color: colors.primaryText,
            cursor: 'pointer',
            boxShadow: isHolding
              ? `0 0 35px ${colors.accentGlow}, inset 0 0 15px rgba(255,255,255,0.4)`
              : `0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px ${colors.accentGlow}44`,
            transform: isHolding ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            outline: 'none',
          }}
        >
          <span style={{ transform: isHolding ? 'scale(1.15) rotate(5deg)' : 'scale(1)', transition: 'transform 0.2s ease' }}>
            ✉️
          </span>
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.primaryText, letterSpacing: '0.02em' }}>
          {gesture.triggerPromptText || 'Press & hold to break the seal'}
        </p>
        <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: colors.secondaryText, opacity: 0.85 }}>
          {gesture.instructions || 'Hold steady until the seal breaks'}
        </p>
      </div>
    </div>
  );
};
