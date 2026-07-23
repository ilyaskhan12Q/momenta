import { AudioTokens } from '../contracts/ExperiencePresentationContract';
import { IAudioRegistry } from '../registries/interfaces/IAudioRegistry';
import { AudioRegistry } from '../registries/AudioRegistry';

export class AudioResolver {
  constructor(private readonly audioRegistry: IAudioRegistry = new AudioRegistry()) {}

  resolve(primaryEmotion: string): AudioTokens {
    if (primaryEmotion === 'JOYFUL_BURST') {
      return this.audioRegistry.getAudio('CELEBRATION_STRINGS');
    }
    return this.audioRegistry.getAudio('WARM_PIANO_AMBIENT');
  }
}
