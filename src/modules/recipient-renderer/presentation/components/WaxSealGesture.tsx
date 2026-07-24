'use client';

import React, { useState, useRef } from 'react';
import type { GestureTokens, ColorTokens } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface WaxSealGestureProps {
  gesture: GestureTokens;
  colors: ColorTokens;
  onComplete: () => void;
}

export const WaxSealGesture: React.FC<WaxSealGestureProps> = ({ gesture, colors, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startHold = () => {
    let current = 0;
    timerRef.current = setInterval(() => {
      current += 10;
      if (current >= 100) {
        clearInterval(timerRef.current!);
        setProgress(100);
        onComplete();
      } else {
        setProgress(current);
      }
    }, 50);
  };

  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progress < 100) setProgress(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `2px solid ${colors.accentGlow}`,
          background: colors.surfaceGlass,
          color: colors.primaryText,
          cursor: 'pointer',
          boxShadow: `0 0 ${20 + progress * 0.3}px ${colors.accentGlow}`,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          transform: `scale(${1 + progress * 0.002})`,
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
      >
        <span>✉️</span>
      </button>
      <div style={{ color: colors.secondaryText, fontSize: '14px', letterSpacing: '0.05em' }}>
        {gesture.triggerPromptText || 'Press & hold to break seal'} ({progress}%)
      </div>
    </div>
  );
};
