'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import type { StoryManifestV1 } from '@/modules/story-manifest/domain/contracts/StoryManifestV1';
import { ExperienceStateMachine } from '@/modules/recipient-renderer/domain/ExperienceStateMachine';
import type {
  ExperienceStateContext,
  ExperienceStateTransition,
} from '@/modules/recipient-renderer/domain/ExperienceStateMachine';

interface CinematicExperienceContextValue {
  context: ExperienceStateContext;
  manifest: StoryManifestV1 | null;
  dispatch: (action: ExperienceStateTransition) => boolean;
  setUnlockProgress: (progress: number) => void;
  setSceneIndex: (index: number) => void;
}

const CinematicExperienceContext = createContext<CinematicExperienceContextValue | null>(null);

export interface CinematicExperienceProviderProps {
  token: string;
  initialManifest?: StoryManifestV1 | null;
  children: React.ReactNode;
}

export function CinematicExperienceProvider({
  token,
  initialManifest = null,
  children,
}: CinematicExperienceProviderProps) {
  const [manifest, setManifest] = useState<StoryManifestV1 | null>(initialManifest);
  const stateMachine = useMemo(() => new ExperienceStateMachine(initialManifest ? 'UNOPENED' : 'LOADING'), [initialManifest]);
  const [context, setContext] = useState<ExperienceStateContext>(stateMachine.getSnapshot());

  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((updatedContext) => {
      setContext(updatedContext);
    });
    return () => unsubscribe();
  }, [stateMachine]);

  useEffect(() => {
    if (initialManifest) {
      stateMachine.setTotalScenes(initialManifest.scenes.length);
      return;
    }

    let isSubscribed = true;

    async function loadManifest() {
      try {
        let loadedManifest: StoryManifestV1 | null = null;

        const res = await fetch(`/api/v1/manifests/${token}`);
        if (res.ok) {
          const json = await res.json();
          if (json && json.data) {
            loadedManifest = json.data;
          }
        }

        if (!loadedManifest) {
          const { localExperienceService } = await import('@/modules/story-manifest/infrastructure/client/LocalExperienceService');
          loadedManifest = localExperienceService.getManifest(token);
        }

        if (isSubscribed) {
          if (loadedManifest) {
            setManifest(loadedManifest);
            stateMachine.setTotalScenes(loadedManifest.scenes.length);
            stateMachine.transition({ type: 'MANIFEST_LOADED' });
          } else {
            stateMachine.transition({
              type: 'MANIFEST_ERROR',
              payload: { message: 'Experience link not found or expired' },
            });
          }
        }
      } catch (err) {
        if (isSubscribed) {
          stateMachine.transition({
            type: 'MANIFEST_ERROR',
            payload: { message: err instanceof Error ? err.message : 'Failed to load experience' },
          });
        }
      }
    }

    loadManifest();

    return () => {
      isSubscribed = false;
    };
  }, [token, initialManifest, stateMachine]);

  const value = useMemo(
    () => ({
      context,
      manifest,
      dispatch: (action: ExperienceStateTransition) => stateMachine.transition(action),
      setUnlockProgress: (progress: number) => stateMachine.setUnlockProgress(progress),
      setSceneIndex: (index: number) => stateMachine.setSceneIndex(index),
    }),
    [context, manifest, stateMachine]
  );

  return (
    <CinematicExperienceContext.Provider value={value}>
      {children}
    </CinematicExperienceContext.Provider>
  );
}

export function useCinematicExperience(): CinematicExperienceContextValue {
  const ctx = useContext(CinematicExperienceContext);
  if (!ctx) {
    throw new Error('useCinematicExperience must be used within a CinematicExperienceProvider');
  }
  return ctx;
}
