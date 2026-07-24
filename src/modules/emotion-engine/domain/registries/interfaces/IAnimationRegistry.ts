import type { AnimationTokens } from '../../contracts/ExperiencePresentationContract';

export interface IAnimationRegistry {
  getAnimation(key: string): AnimationTokens;
  registerAnimation(key: string, tokens: AnimationTokens): void;
}

export const IAnimationRegistry = {};
