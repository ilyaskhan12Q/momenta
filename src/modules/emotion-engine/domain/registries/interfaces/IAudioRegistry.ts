import { AudioTokens } from '../../contracts/ExperiencePresentationContract';

export interface IAudioRegistry {
  getAudio(key: string): AudioTokens;
  registerAudio(key: string, tokens: AudioTokens): void;
}
