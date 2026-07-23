'use client';

import React, { useState, useEffect } from 'react';
import { ManifestSceneBeat } from '../../../story-manifest/domain/contracts/StoryManifestV1';
import { ExperiencePresentationContract } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface SceneTimelineViewerProps {
  scenes: ManifestSceneBeat[];
  presentation: ExperiencePresentationContract;
  onComplete: () => void;
}

export const SceneTimelineViewer: React.FC<SceneTimelineViewerProps> = ({ scenes, presentation, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentScene = scenes[currentIndex] || scenes[0];

  useEffect(() => {
    if (!currentScene) return;
    const duration = currentScene.durationMs || 5000;

    const timer = setTimeout(() => {
      if (currentIndex < scenes.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onComplete();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, scenes, currentScene, onComplete]);

  const handleNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      onClick={handleNext}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
    >
      {/* Top Timeline Progress Indicators */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          gap: '8px',
          zIndex: 10,
        }}
      >
        {scenes.map((_, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: idx <= currentIndex ? presentation.colors.accentGlow : presentation.colors.borderGlass,
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Main Glassmorphic Text Card */}
      <div
        style={{
          background: presentation.colors.surfaceGlass,
          border: `1px solid ${presentation.colors.borderGlass}`,
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          padding: '48px 36px',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
          color: presentation.colors.primaryText,
          textAlign: 'center',
          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <p
          style={{
            fontFamily: presentation.typography.headerFontFamily,
            fontSize: `${presentation.typography.baseFontSizePx * 1.5}px`,
            lineHeight: presentation.typography.lineHeight,
            letterSpacing: presentation.typography.letterSpacing,
            margin: 0,
          }}
        >
          {currentScene.textBeat}
        </p>
      </div>

      {/* Navigation Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          color: presentation.colors.secondaryText,
          fontSize: '13px',
          letterSpacing: '0.05em',
        }}
      >
        Tap anywhere to advance ({currentIndex + 1} / {scenes.length})
      </div>
    </div>
  );
};
