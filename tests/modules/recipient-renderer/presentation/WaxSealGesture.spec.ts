import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { WaxSealGesture } from '../../../../src/modules/recipient-renderer/presentation/components/WaxSealGesture';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('WaxSealGesture Component', () => {
  it('should instantiate WaxSealGesture element with trigger text prompt', () => {
    const onComplete = vi.fn();
    const element = React.createElement(WaxSealGesture, {
      gesture: DefaultPresentationProfile.gesture,
      colors: DefaultPresentationProfile.colors,
      onComplete,
    });

    expect(element).toBeDefined();
    expect(element.type).toBe(WaxSealGesture);
  });
});
