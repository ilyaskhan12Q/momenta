'use client';

import React from 'react';
import type { StoryManifestV1 } from '../../../story-manifest/domain/contracts/StoryManifestV1';
import { WaxSealGesture } from './WaxSealGesture';

export interface ExperienceSplashProps {
  manifest: StoryManifestV1;
  onOpen: (audioCtx: AudioContext) => void;
}

export const ExperienceSplash: React.FC<ExperienceSplashProps> = ({ manifest, onOpen }) => {
  const { presentation, senderDisplayName, relationship, occasion } = manifest;

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: presentation.colors.primaryText,
        fontFamily: presentation.typography.bodyFontFamily,
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: presentation.colors.surfaceGlass,
          border: `1px solid ${presentation.colors.borderGlass}`,
          backdropFilter: 'blur(16px)',
          borderRadius: '24px',
          padding: '48px 32px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', color: presentation.colors.secondaryText, marginBottom: '12px' }}>
          {relationship} • {occasion}
        </div>
        <h1
          style={{
            fontFamily: presentation.typography.headerFontFamily,
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '32px',
            lineHeight: 1.2,
          }}
        >
          A Momenta Experience from {senderDisplayName}
        </h1>

        <WaxSealGesture
          gesture={presentation.gesture}
          colors={presentation.colors}
          onComplete={handleGestureComplete}
        />
      </div>
    </div>
  );
};
