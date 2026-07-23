import { IAnimationRegistry } from './interfaces/IAnimationRegistry';
import { AnimationTokens } from '../contracts/ExperiencePresentationContract';
import { DefaultPresentationProfile } from '../fallbacks/DefaultPresentationProfile';

export class AnimationRegistry implements IAnimationRegistry {
  private registry = new Map<string, AnimationTokens>();

  constructor() {
    this.registerAnimation('FADE_SLIDE', {
      sceneTransitionType: 'FADE_SLIDE',
      entranceDurationMs: 800,
      exitDurationMs: 600,
      easingCurve: 'cubic-bezier(0.25, 1, 0.5, 1)',
      reducedMotionFallback: false,
    });
    this.registerAnimation('ZOOM_DISSOLVE', {
      sceneTransitionType: 'ZOOM_DISSOLVE',
      entranceDurationMs: 1000,
      exitDurationMs: 800,
      easingCurve: 'cubic-bezier(0.4, 0, 0.2, 1)',
      reducedMotionFallback: false,
    });
  }

  getAnimation(key: string): AnimationTokens {
    return this.registry.get(key) || DefaultPresentationProfile.animation;
  }

  registerAnimation(key: string, tokens: AnimationTokens): void {
    this.registry.set(key, tokens);
  }
}
