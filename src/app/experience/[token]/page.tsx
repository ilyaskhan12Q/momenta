'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { StoryManifestV1 } from '@/modules/story-manifest/domain/contracts/StoryManifestV1';
import { ExperienceSplash } from '@/modules/recipient-renderer/presentation/components/ExperienceSplash';
import { ShaderBackgroundCanvas } from '@/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas';
import { AudioSoundscapeEngine } from '@/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine';
import { SceneTimelineViewer } from '@/modules/recipient-renderer/presentation/components/SceneTimelineViewer';
import { ExperienceOutro } from '@/modules/recipient-renderer/presentation/components/ExperienceOutro';
import { getRelationshipTheme } from '@/modules/recipient-renderer/domain/relationship-presets';

export type RecipientPlaybackState = 'LOADING' | 'UNOPENED' | 'PLAYING' | 'COMPLETED' | 'ERROR';

export default function ExperiencePage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>('');
  const [manifest, setManifest] = useState<StoryManifestV1 | null>(null);
  const [state, setState] = useState<RecipientPlaybackState>('LOADING');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const audioEngineRef = useRef<AudioSoundscapeEngine | null>(null);

  useEffect(() => {
    params.then(async (p) => {
      setToken(p.token);
      let loadedManifest: StoryManifestV1 | null = null;

      try {
        const res = await fetch(`/api/v1/manifests/${p.token}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            loadedManifest = json.data;
          }
        }
      } catch {
        // Fetch failed or non-JSON response
      }

      if (!loadedManifest) {
        const { localExperienceService } = await import('@/modules/story-manifest/infrastructure/client/LocalExperienceService');
        loadedManifest = localExperienceService.getManifest(p.token);
      }

      if (loadedManifest) {
        setManifest(loadedManifest);
        setState('UNOPENED');
      } else {
        setErrorMsg('Experience link not found or expired');
        setState('ERROR');
      }
    });
  }, [params]);

  const theme = manifest ? getRelationshipTheme(manifest.relationship, manifest.presentation.colors, manifest.presentation.typography) : null;

  const handleGestureProgress = (progress: number) => {
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
    setState('PLAYING');
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
    setState('COMPLETED');
  };

  const handleSendHeart = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.playHeartSwell();
    }
  };

  const handleReplay = () => {
    setState('UNOPENED');
  };

  if (state === 'LOADING') {
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
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '20px', fontSize: '14px', color: '#94a3b8' }}>Preparing your Momenta experience...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (state === 'ERROR' || !manifest || !theme) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#090d16', textAlign: 'center', padding: '24px' }}>
        <h2>Experience Unavailable</h2>
        <p style={{ color: '#94a3b8', maxWidth: '400px', marginTop: '12px' }}>{errorMsg || 'This experience link may be invalid, deleted, or expired.'}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: theme.colors.background, overflow: 'hidden' }}>
      {/* Background WebGL Shader Canvas & Particle Overlay */}
      <ShaderBackgroundCanvas
        shader={theme.shader}
        colors={theme.colors}
        particleType={theme.particles.type}
        reducedMotion={manifest.presentation.animation.reducedMotionFallback}
      />

      {state === 'UNOPENED' && (
        <ExperienceSplash
          manifest={manifest}
          onOpen={handleOpenExperience}
          onGestureProgress={handleGestureProgress}
        />
      )}

      {state === 'PLAYING' && (
        <SceneTimelineViewer
          scenes={manifest.scenes}
          presentation={manifest.presentation}
          relationship={manifest.relationship}
          onAdvanceScene={handleAdvanceScene}
          onComplete={handleTimelineComplete}
        />
      )}

      {state === 'COMPLETED' && (
        <ExperienceOutro
          manifest={manifest}
          onReplay={handleReplay}
          onSendHeart={handleSendHeart}
        />
      )}
    </div>
  );
}
