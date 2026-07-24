'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { ManifestSceneBeat } from '../../../story-manifest/domain/contracts/StoryManifestV1';
import type { ExperiencePresentationContract } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';
import { getRelationshipTheme } from '../../domain/relationship-presets';

export interface SceneTimelineViewerProps {
  scenes: ManifestSceneBeat[];
  presentation: ExperiencePresentationContract;
  relationship?: string;
  onAdvanceScene?: () => void;
  onComplete: () => void;
}

export const SceneTimelineViewer: React.FC<SceneTimelineViewerProps> = ({
  scenes,
  presentation,
  relationship = 'Custom',
  onAdvanceScene,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [keyCounter, setKeyCounter] = useState(0);

  const theme = getRelationshipTheme(relationship, presentation.colors, presentation.typography);
  const { colors, typography } = theme;

  const currentScene = scenes[currentIndex] || scenes[0];
  const words = (currentScene.textBeat || '').split(' ');

  // Auto-advance timer per scene
  useEffect(() => {
    if (!currentScene) return;
    const duration = currentScene.durationMs || Math.max(5000, words.length * 400);

    const timer = setTimeout(() => {
      handleNext();
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, scenes, currentScene]);

  // Handle subtle 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10; // -5 to +5 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleNext = () => {
    if (onAdvanceScene) onAdvanceScene();

    if (currentIndex < scenes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setKeyCounter((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setKeyCounter((prev) => prev + 1);
    }
  };

  return (
    <div
      onClick={handleNext}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 24px',
        boxSizing: 'border-box',
        cursor: 'pointer',
        userSelect: 'none',
        zIndex: 10,
      }}
    >
      {/* Top Minimalist Timeline Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: '28px',
          left: '32px',
          right: '32px',
          display: 'flex',
          gap: '10px',
          zIndex: 20,
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        {scenes.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: '3px',
              borderRadius: '3px',
              background: idx <= currentIndex ? colors.accentGlow : colors.borderGlass,
              boxShadow: idx === currentIndex ? `0 0 12px ${colors.accentGlow}` : 'none',
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Central Floating Memory Card with 3D Parallax Tilt */}
      <div
        key={keyCounter}
        style={{
          perspective: '1000px',
          maxWidth: '680px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: 'transform 0.15s ease-out, opacity 0.5s ease',
            background: colors.surfaceGlass,
            border: `1px solid ${colors.borderGlass}`,
            backdropFilter: 'blur(28px)',
            borderRadius: '36px',
            padding: '56px 44px',
            width: '100%',
            boxShadow: `0 35px 80px rgba(0, 0, 0, 0.6), 0 0 40px ${colors.accentGlow}15`,
            color: colors.primaryText,
            textAlign: 'center',
            animation: 'sceneEntrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Staggered Word Reveal */}
          <div
            style={{
              fontFamily: typography.headerFontFamily,
              fontSize: `${Math.max(22, (typography.baseFontSizePx || 18) * 1.55)}px`,
              lineHeight: typography.lineHeight || 1.6,
              letterSpacing: typography.letterSpacing || '0.02em',
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px 12px',
            }}
          >
            {words.map((word, wIdx) => (
              <span
                key={wIdx}
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  transform: 'translateY(12px)',
                  animation: `wordFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${wIdx * 0.08}s forwards`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Scene Counter & Touch Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          color: colors.secondaryText,
          fontSize: '13px',
          letterSpacing: '0.08em',
          zIndex: 20,
        }}
      >
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            style={{
              background: colors.surfaceGlass,
              border: `1px solid ${colors.borderGlass}`,
              color: colors.primaryText,
              borderRadius: '20px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ← Previous
          </button>
        )}
        <span>
          Tap anywhere to advance ({currentIndex + 1} of {scenes.length})
        </span>
      </div>

      <style>{`
        @keyframes sceneEntrance {
          0% { opacity: 0; transform: scale(0.95) translateY(15px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes wordFadeIn {
          0% { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
};
