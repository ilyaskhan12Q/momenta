import { GestureTokens } from '../../contracts/ExperiencePresentationContract';

export interface IGestureRegistry {
  getGesture(key: string): GestureTokens;
  registerGesture(key: string, tokens: GestureTokens): void;
}
