'use client';

import React, { useState, useRef } from 'react';
import type { CinematicRelationshipTheme } from '../../domain/relationship-presets';
import { WaxSealGesture } from './WaxSealGesture';

export interface InteractiveGestureControllerProps {
  theme: CinematicRelationshipTheme;
  onProgress?: (progress: number) => void;
  onComplete: () => void;
}

export const InteractiveGestureController: React.FC<InteractiveGestureControllerProps> = ({
  theme,
  onProgress,
  onComplete,
}) => {
  const gestureType = theme.gesture.type || 'WAX_SEAL';
  const { colors, gesture } = theme;

  // 1. SATIN RIBBON UNTYING GESTURE
  if (gestureType === 'SATIN_RIBBON') {
    const [sliderValue, setSliderValue] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setSliderValue(val);
      if (onProgress) onProgress(val);
      if (val >= 98) {
        onComplete();
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', maxWidth: '320px', userSelect: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: '56px', display: 'flex', alignItems: 'center' }}>
          {/* Ribbon Background Track */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '28px',
              background: colors.surfaceGlass,
              border: `1px solid ${colors.borderGlass}`,
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${sliderValue}%`,
                background: `linear-gradient(90deg, ${colors.accentGlow}66, ${colors.accentGlow})`,
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Ribbon Bow Icon */}
          <div
            style={{
              position: 'absolute',
              left: `calc(${sliderValue}% * 0.82 + 8px)`,
              pointerEvents: 'none',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: colors.accentGlow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
              boxShadow: `0 0 20px ${colors.accentGlow}`,
              transition: 'left 0.1s linear',
              zIndex: 3,
            }}
          >
            🎀
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleChange}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 4,
            }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.primaryText }}>
            {gesture.triggerPromptText || 'Slide across to untie the velvet ribbon'}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: colors.secondaryText, opacity: 0.85 }}>
            {gesture.instructions || 'Drag the ribbon to open your story'}
          </p>
        </div>
      </div>
    );
  }

  // 2. MEMORY CANDLE FLAME GESTURE
  if (gestureType === 'MEMORY_CANDLE') {
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startHold = () => {
      setIsHolding(true);
      let current = progress;
      timerRef.current = setInterval(() => {
        current += 5;
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
      if (progress < 100) setProgress(0);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', userSelect: 'none' }}>
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: `2px solid ${colors.accentGlow}`,
            background: colors.surfaceGlass,
            color: colors.primaryText,
            cursor: 'pointer',
            boxShadow: `0 0 ${20 + progress * 0.4}px ${colors.accentGlow}`,
            transform: `scale(${1 + progress * 0.0015})`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            fontSize: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          <span>🕯️</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.primaryText }}>
            {gesture.triggerPromptText || 'Touch & hold to kindle the flame'}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: colors.secondaryText, opacity: 0.85 }}>
            {gesture.instructions || 'Hold steady to illuminate the experience'} ({progress}%)
          </p>
        </div>
      </div>
    );
  }

  // 3. UNFOLD PARCHMENT GESTURE
  if (gestureType === 'UNFOLD_PARCHMENT') {
    const [cornersUnlocked, setCornersUnlocked] = useState<number>(0);

    const handleCornerTap = (cornerIdx: number) => {
      if (cornersUnlocked >= cornerIdx) {
        const next = cornersUnlocked + 1;
        setCornersUnlocked(next);
        if (onProgress) onProgress(next * 25);
        if (next >= 4) {
          setTimeout(onComplete, 300);
        }
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', userSelect: 'none' }}>
        <div
          style={{
            position: 'relative',
            width: '160px',
            height: '120px',
            background: colors.surfaceGlass,
            border: `2px dashed ${colors.borderGlass}`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 10px 30px rgba(0,0,0,0.4)`,
          }}
        >
          <span style={{ fontSize: '32px' }}>✉️</span>
          {[0, 1, 2, 3].map((idx) => (
            <button
              key={idx}
              onClick={() => handleCornerTap(idx)}
              style={{
                position: 'absolute',
                top: idx < 2 ? '-12px' : 'auto',
                bottom: idx >= 2 ? '-12px' : 'auto',
                left: idx % 2 === 0 ? '-12px' : 'auto',
                right: idx % 2 === 1 ? '-12px' : 'auto',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: idx < cornersUnlocked ? colors.accentGlow : colors.surfaceGlass,
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: idx < cornersUnlocked ? `0 0 12px ${colors.accentGlow}` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {idx < cornersUnlocked ? '✓' : '✨'}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.primaryText }}>
            {gesture.triggerPromptText || 'Touch the glowing corners to unfold'}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: colors.secondaryText, opacity: 0.85 }}>
            Unfolded ({cornersUnlocked}/4 corners)
          </p>
        </div>
      </div>
    );
  }

  // 4. HERITAGE LOCKET KEY GESTURE
  if (gestureType === 'HERITAGE_LOCKET') {
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
      if (progress < 100) setProgress(0);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', userSelect: 'none' }}>
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            border: `2px solid ${colors.accentGlow}`,
            background: colors.surfaceGlass,
            color: colors.primaryText,
            cursor: 'pointer',
            boxShadow: `0 0 ${20 + progress * 0.4}px ${colors.accentGlow}`,
            transform: `scale(${1 + progress * 0.0015})`,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            fontSize: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
        >
          <span>🔑</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: colors.primaryText }}>
            {gesture.triggerPromptText || 'Hold key emblem to unlock memory box'}
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: colors.secondaryText, opacity: 0.85 }}>
            {gesture.instructions || 'Unlocking locket...'} ({progress}%)
          </p>
        </div>
      </div>
    );
  }

  // DEFAULT FALLBACK: WAX SEAL
  return <WaxSealGesture gesture={theme.gesture} colors={colors} onProgress={onProgress} onComplete={onComplete} />;
};
