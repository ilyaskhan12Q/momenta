'use client';

import React, { useState } from 'react';
import type { StoryManifestV1 } from '../../../story-manifest/domain/contracts/StoryManifestV1';
import { getRelationshipTheme } from '../../domain/relationship-presets';

export interface ExperienceOutroProps {
  manifest: StoryManifestV1;
  onReplay: () => void;
  onSendHeart?: () => void;
}

export const ExperienceOutro: React.FC<ExperienceOutroProps> = ({ manifest, onReplay, onSendHeart }) => {
  const [heartSent, setHeartSent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const { senderDisplayName, relationship, scenes, presentation } = manifest;
  const theme = getRelationshipTheme(relationship, presentation.colors, presentation.typography);
  const { colors, typography } = theme;

  const handleHeartClick = () => {
    setHeartSent(true);
    if (onSendHeart) onSendHeart();
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
          backdropFilter: 'blur(28px)',
          borderRadius: '36px',
          padding: '52px 36px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeInOutro 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>

        <h2
          style={{
            fontFamily: typography.headerFontFamily,
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '12px',
            lineHeight: 1.25,
            background: `linear-gradient(180deg, ${colors.primaryText} 0%, ${colors.secondaryText} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Made Just For You
        </h2>

        <p
          style={{
            fontSize: '15px',
            color: colors.secondaryText,
            marginBottom: '24px',
            maxWidth: '420px',
            lineHeight: 1.6,
          }}
        >
          {theme.outroMessage}
        </p>

        <p
          style={{
            fontSize: '13px',
            color: colors.primaryText,
            opacity: 0.85,
            marginBottom: '36px',
            fontWeight: 600,
          }}
        >
          From {senderDisplayName || 'Someone Special'}
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '320px' }}>
          {/* Send Heart Back Reaction */}
          <button
            onClick={handleHeartClick}
            disabled={heartSent}
            style={{
              width: '100%',
              background: heartSent
                ? 'rgba(236, 72, 153, 0.2)'
                : `linear-gradient(135deg, ${colors.accentGlow}, #ec4899)`,
              border: `1px solid ${colors.borderGlass}`,
              color: '#ffffff',
              padding: '14px 24px',
              borderRadius: '16px',
              cursor: heartSent ? 'default' : 'pointer',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: heartSent ? 'none' : `0 8px 20px ${colors.accentGlow}55`,
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>{heartSent ? '❤️ Heart Sent' : '💖 Send a Heart Back'}</span>
          </button>

          {/* Toggle Memory Summary */}
          <button
            onClick={() => setShowSummary(!showSummary)}
            style={{
              width: '100%',
              background: colors.surfaceGlass,
              border: `1px solid ${colors.borderGlass}`,
              color: colors.primaryText,
              padding: '12px 24px',
              borderRadius: '16px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            {showSummary ? 'Hide Memory Story' : '📜 View Full Memory Story'}
          </button>

          {/* Replay Button */}
          <button
            onClick={onReplay}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: colors.secondaryText,
              padding: '10px 24px',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            ↺ Replay Experience
          </button>
        </div>

        {/* Story Summary Card */}
        {showSummary && (
          <div
            style={{
              marginTop: '28px',
              paddingTop: '24px',
              borderTop: `1px solid ${colors.borderGlass}`,
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxHeight: '240px',
              overflowY: 'auto',
            }}
          >
            {scenes.map((scene, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '13px',
                  color: colors.primaryText,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: colors.secondaryText, fontWeight: 600, fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                  Scene {idx + 1}
                </span>
                {scene.textBeat}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInOutro {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};
