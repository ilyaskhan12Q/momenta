import { AnimationTokens } from '../contracts/ExperiencePresentationContract';
import { IAnimationRegistry } from '../registries/interfaces/IAnimationRegistry';
import { AnimationRegistry } from '../registries/AnimationRegistry';

export class AnimationResolver {
  constructor(private readonly animationRegistry: IAnimationRegistry = new AnimationRegistry()) {}

  resolve(primaryEmotion: string): AnimationTokens {
    if (primaryEmotion === 'JOYFUL_BURST') {
      return this.animationRegistry.getAnimation('ZOOM_DISSOLVE');
    }
    return this.animationRegistry.getAnimation('FADE_SLIDE');
  }
}
