import type { EmotionProfileData } from '../../contracts/ExperiencePresentationContract';

export interface IEmotionRegistry {
  getProfile(key: string): EmotionProfileData;
  registerProfile(key: string, profile: EmotionProfileData): void;
}

export const IEmotionRegistry = {};
