'use client';

import React, { useState, useEffect, useRef } from 'react';
import { StoryManifestV1 } from '@/modules/story-manifest/domain/contracts/StoryManifestV1';
import { ExperienceSplash } from '@/modules/recipient-renderer/presentation/components/ExperienceSplash';
import { ShaderBackgroundCanvas } from '@/modules/recipient-renderer/infrastructure/webgl/ShaderBackgroundCanvas';
import { AudioSoundscapeEngine } from '@/modules/recipient-renderer/infrastructure/audio/AudioSoundscapeEngine';
import { SceneTimelineViewer } from '@/modules/recipient-renderer/presentation/components/SceneTimelineViewer';

export type RecipientPlaybackState = 'LOADING' | 'UNOPENED' | 'PLAYING' | 'COMPLETED' | 'ERROR';

export default function ExperiencePage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string>('');
  const [manifest, setManifest] = useState<StoryManifestV1 | null>(null);
  const [state, setState] = useState<RecipientPlaybackState>('LOADING');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const audioEngineRef = useRef<AudioSoundscapeEngine | null>(null);

  useEffect(() => {
    params.then((p) => {
      setToken(p.token);
      fetch(`/api/v1/manifests/${p.token}`)
        .then((res) => {
          if (!res.ok) throw new Error('Experience not found or expired');
          return res.json();
        })
        .then((json) => {
          setManifest(json.data);
          setState('UNOPENED');
        })
        .catch((err) => {
          setErrorMsg((err as Error).message);
          setState('ERROR');
        });
    });
  }, [params]);

  const handleOpenExperience = (audioCtx: AudioContext) => {
    if (!manifest) return;
    const engine = new AudioSoundscapeEngine();
    engine.initialize(audioCtx, manifest.presentation.audio);
    engine.start();
    audioEngineRef.current = engine;
    setState('PLAYING');
  };

  const handleTimelineComplete = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
    }
    setState('COMPLETED');
  };

  if (state === 'LOADING') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#0a0d14' }}>
        <p>Opening Momenta Experience...</p>
      </div>
    );
  }

  if (state === 'ERROR' || !manifest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#0a0d14', textAlign: 'center', padding: '24px' }}>
        <h2>Experience Unavailable</h2>
        <p style={{ color: '#94a3b8' }}>{errorMsg || 'This experience link may be invalid, deleted, or expired.'}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: manifest.presentation.colors.background, overflow: 'hidden' }}>
      <ShaderBackgroundCanvas
        shader={manifest.presentation.shader}
        colors={manifest.presentation.colors}
        reducedMotion={manifest.presentation.animation.reducedMotionFallback}
      />

      {state === 'UNOPENED' && (
        <ExperienceSplash manifest={manifest} onOpen={handleOpenExperience} />
      )}

      {state === 'PLAYING' && (
        <SceneTimelineViewer
          scenes={manifest.scenes}
          presentation={manifest.presentation}
          onComplete={handleTimelineComplete}
        />
      )}

      {state === 'COMPLETED' && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: manifest.presentation.colors.primaryText, textAlign: 'center', padding: '24px' }}>
          <div style={{ background: manifest.presentation.colors.surfaceGlass, border: `1px solid ${manifest.presentation.colors.borderGlass}`, backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '40px', maxWidth: '480px', width: '100%' }}>
            <h2 style={{ fontFamily: manifest.presentation.typography.headerFontFamily, fontSize: '28px', marginBottom: '16px' }}>
              The End
            </h2>
            <p style={{ color: manifest.presentation.colors.secondaryText, marginBottom: '24px' }}>
              Thank you for sharing in this Momenta experience from {manifest.senderDisplayName}.
            </p>
            <button
              onClick={() => setState('PLAYING')}
              style={{
                background: manifest.presentation.colors.accentGlow,
                border: 'none',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Replay Experience
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
