import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { SceneTimelineViewer } from '../../../../src/modules/recipient-renderer/presentation/components/SceneTimelineViewer';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('SceneTimelineViewer Component', () => {
  it('should instantiate SceneTimelineViewer element with timeline scenes', () => {
    const scenes = [
      { sequenceOrder: 1, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 1 text' },
      { sequenceOrder: 2, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 2 text' },
    ];
    const onComplete = vi.fn();

    const element = React.createElement(SceneTimelineViewer, {
      scenes,
      presentation: DefaultPresentationProfile,
      onComplete,
    });

    expect(element).toBeDefined();
    expect(element.type).toBe(SceneTimelineViewer);
  });
});
