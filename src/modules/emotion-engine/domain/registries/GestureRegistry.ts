import { IGestureRegistry } from './interfaces/IGestureRegistry';
import { GestureTokens } from '../contracts/ExperiencePresentationContract';
import { DefaultPresentationProfile } from '../fallbacks/DefaultPresentationProfile';

export class GestureRegistry implements IGestureRegistry {
  private registry = new Map<string, GestureTokens>();

  constructor() {
    this.registerGesture('WAX_SEAL', {
      gestureType: 'WAX_SEAL',
      triggerPromptText: 'Press & hold to break seal',
      completionFeedbackStyle: 'GOLDEN_PARTICLES',
    });
    this.registerGesture('RIBBON_PULL', {
      gestureType: 'RIBBON_PULL',
      triggerPromptText: 'Swipe across to untie ribbon',
      completionFeedbackStyle: 'SATIN_UNROLL',
    });
    this.registerGesture('CANDLE_BLOW', {
      gestureType: 'CANDLE_BLOW',
      triggerPromptText: 'Hold micro button to blow out candle',
      completionFeedbackStyle: 'SMOKE_DISSOLVE',
    });
    this.registerGesture('LETTER_FLIP', {
      gestureType: 'LETTER_FLIP',
      triggerPromptText: 'Tap to unseal envelope',
      completionFeedbackStyle: 'PAPER_FLAP',
    });
  }

  getGesture(key: string): GestureTokens {
    return this.registry.get(key) || DefaultPresentationProfile.gesture;
  }

  registerGesture(key: string, tokens: GestureTokens): void {
    this.registry.set(key, tokens);
  }
}
