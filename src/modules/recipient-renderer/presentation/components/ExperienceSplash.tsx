'use client';

import React from 'react';
import type { StoryManifestV1 } from '../../../story-manifest/domain/contracts/StoryManifestV1';
import { getRelationshipTheme } from '../../domain/relationship-presets';
import { InteractiveGestureController } from './InteractiveGestureController';

export interface ExperienceSplashProps {
  manifest: StoryManifestV1;
  onOpen: (audioCtx: AudioContext) => void;
  onGestureProgress?: (progress: number) => void;
}

export const ExperienceSplash: React.FC<ExperienceSplashProps> = ({ manifest, onOpen, onGestureProgress }) => {
  const { senderDisplayName, relationship, occasion, presentation } = manifest;

  const theme = getRelationshipTheme(relationship, presentation.colors, presentation.typography);
  const { colors, typography } = theme;

  const handleGestureComplete = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    onOpen(audioCtx);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primaryText,
        fontFamily: typography.bodyFontFamily,
        padding: '32px 24px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: colors.surfaceGlass,
          border: `1px solid ${colors.borderGlass}`,
          backdropFilter: 'blur(24px)',
          borderRadius: '36px',
          padding: '52px 36px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInSplash 1s ease-out forwards',
        }}
      >
        {/* Relationship Tagline */}
        <div
          style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: colors.secondaryText,
            marginBottom: '16px',
            fontWeight: 600,
          }}
        >
          {relationship} • {occasion || 'A Moment For You'}
        </div>

        {/* Cinematic Title */}
        <h1
          style={{
            fontFamily: typography.headerFontFamily,
            fontSize: '34px',
            fontWeight: 700,
            marginBottom: '12px',
            lineHeight: 1.25,
            background: `linear-gradient(180deg, ${colors.primaryText} 0%, ${colors.secondaryText} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          A Moment from {senderDisplayName || 'Someone Special'}
        </h1>

        <p
          style={{
            fontSize: '15px',
            color: colors.secondaryText,
            marginBottom: '40px',
            maxWidth: '400px',
            lineHeight: 1.6,
            opacity: 0.9,
          }}
        >
          {theme.relationshipTagline}
        </p>

        {/* Interactive Gesture Element */}
        <InteractiveGestureController
          theme={theme}
          onProgress={onGestureProgress}
          onComplete={handleGestureComplete}
        />
      </div>

      <style>{`
        @keyframes fadeInSplash {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
