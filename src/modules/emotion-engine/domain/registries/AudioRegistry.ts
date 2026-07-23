import { IAudioRegistry } from './interfaces/IAudioRegistry';
import { AudioTokens } from '../contracts/ExperiencePresentationContract';
import { DefaultPresentationProfile } from '../fallbacks/DefaultPresentationProfile';

export class AudioRegistry implements IAudioRegistry {
  private registry = new Map<string, AudioTokens>();

  constructor() {
    this.registerAudio('WARM_PIANO_AMBIENT', {
      stemKey: 'WARM_PIANO_AMBIENT',
      bpm: 72,
      fadeInSeconds: 2.5,
      fadeOutSeconds: 3.0,
      lowPassCutoffHz: 12000,
      reverbMix: 0.35,
    });
    this.registerAudio('CELEBRATION_STRINGS', {
      stemKey: 'CELEBRATION_STRINGS',
      bpm: 110,
      fadeInSeconds: 1.5,
      fadeOutSeconds: 2.0,
      lowPassCutoffHz: 18000,
      reverbMix: 0.25,
    });
  }

  getAudio(key: string): AudioTokens {
    return this.registry.get(key) || DefaultPresentationProfile.audio;
  }

  registerAudio(key: string, tokens: AudioTokens): void {
    this.registry.set(key, tokens);
  }
}
