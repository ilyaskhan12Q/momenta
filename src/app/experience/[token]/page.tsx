'use client';

import { useRef, use } from 'react';
import {
  CinematicExperienceProvider,
  useCinematicExperience,
} from '@/modules/recipient-renderer/presentation/context/CinematicExperienceContext';
import { ExperienceSplash } from '@/modules/recipient-renderer/presentation/components/ExperienceSplash';
import { ShaderBackgroundCanvas } from '@/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas';
import { AudioSoundscapeEngine } from '@/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine';
import { SceneTimelineViewer } from '@/modules/recipient-renderer/presentation/components/SceneTimelineViewer';
import { ExperienceOutro } from '@/modules/recipient-renderer/presentation/components/ExperienceOutro';
import { getRelationshipTheme } from '@/modules/recipient-renderer/domain/relationship-presets';

function ExperiencePageContent() {
  const { context, manifest, dispatch, setUnlockProgress } = useCinematicExperience();
  const audioEngineRef = useRef<AudioSoundscapeEngine | null>(null);

  const theme = manifest
    ? getRelationshipTheme(manifest.relationship, manifest.presentation.colors, manifest.presentation.typography)
    : null;

  const handleGestureProgress = (progress: number) => {
    setUnlockProgress(progress);
    if (audioEngineRef.current) {
      audioEngineRef.current.triggerGestureProgress(progress);
    }
  };

  const handleOpenExperience = (audioCtx: AudioContext) => {
    if (!manifest || !theme) return;
    const engine = new AudioSoundscapeEngine();
    engine.initialize(audioCtx, {
      ...manifest.presentation.audio,
      frequencies: theme.audio.frequencies,
      scaleName: theme.audio.scaleName,
      waveform: theme.audio.waveform,
    });
    engine.start();
    audioEngineRef.current = engine;
    dispatch({ type: 'COMPLETE_UNLOCK' });
  };

  const handleAdvanceScene = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playChime();
    }
  };

  const handleTimelineComplete = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    dispatch({ type: 'COMPLETE_EXPERIENCE' });
  };

  const handleSendHeart = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playHeartSwell();
    }
  };

  const handleReplay = () => {
    dispatch({ type: 'REPLAY' });
  };

  if (context.state === 'LOADING') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          background: '#090d16',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '0.05em',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#6366f1',
            animation: 'spin 1s linear infinite',
          }}
        />
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#94a3b8' }}>Preparing your Momenta experience...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (context.state === 'ERROR' || !manifest || !theme) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          background: '#090d16',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <h2>Experience Unavailable</h2>
        <p style={{ color: '#94a3b8', maxWidth: '400px', marginTop: '12px' }}>
          {context.errorMessage || 'This experience link may be invalid, deleted, or expired.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: theme.colors.background, overflow: 'hidden' }}>
      {/* Background WebGL Shader Canvas & Particle Overlay */}
      <ShaderBackgroundCanvas
        shader={theme.shader}
        colors={theme.colors}
        relationshipType={manifest.relationship}
        currentState={context.state}
        particleType={theme.particles.type}
        reducedMotion={manifest.presentation.animation.reducedMotionFallback}
      />

      {(context.state === 'UNOPENED' || context.state === 'UNLOCKING') && (
        <ExperienceSplash
          manifest={manifest}
          onOpen={handleOpenExperience}
          onGestureProgress={handleGestureProgress}
        />
      )}

      {context.state === 'PLAYING' && (
        <SceneTimelineViewer
          scenes={manifest.scenes}
          presentation={manifest.presentation}
          relationship={manifest.relationship}
          onAdvanceScene={handleAdvanceScene}
          onComplete={handleTimelineComplete}
        />
      )}

      {context.state === 'COMPLETED' && (
        <ExperienceOutro
          manifest={manifest}
          onReplay={handleReplay}
          onSendHeart={handleSendHeart}
        />
      )}
    </div>
  );
}

export default function ExperiencePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = use(params);
  return (
    <CinematicExperienceProvider token={resolvedParams.token}>
      <ExperiencePageContent />
    </CinematicExperienceProvider>
  );
}
