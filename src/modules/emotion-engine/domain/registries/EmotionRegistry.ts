import { IEmotionRegistry } from './interfaces/IEmotionRegistry';
import { EmotionProfileData } from '../contracts/ExperiencePresentationContract';
import { DefaultEmotionProfile } from '../fallbacks/DefaultEmotionProfile';

export class EmotionRegistry implements IEmotionRegistry {
  private profiles = new Map<string, EmotionProfileData>();

  constructor() {
    this.registerProfile('DEEP_ROMANCE', {
      primaryEmotion: 'DEEP_ROMANCE',
      secondaryEmotion: 'NOSTALGIC_WARMTH',
      confidence: 0.9,
      valence: 0.8,
      arousal: 0.7,
      dominance: 0.6,
      intensity: 0.8,
      scores: { DEEP_ROMANCE: 0.9, NOSTALGIC_WARMTH: 0.5, SOLACE_COMFORT: 0.4 },
    });
    this.registerProfile('SOLACE_COMFORT', {
      primaryEmotion: 'SOLACE_COMFORT',
      secondaryEmotion: 'NOSTALGIC_WARMTH',
      confidence: 0.88,
      valence: 0.5,
      arousal: 0.2,
      dominance: 0.4,
      intensity: 0.4,
      scores: { SOLACE_COMFORT: 0.88, NOSTALGIC_WARMTH: 0.6 },
    });
    this.registerProfile('JOYFUL_BURST', {
      primaryEmotion: 'JOYFUL_BURST',
      secondaryEmotion: 'DEEP_ROMANCE',
      confidence: 0.92,
      valence: 0.9,
      arousal: 0.85,
      dominance: 0.7,
      intensity: 0.9,
      scores: { JOYFUL_BURST: 0.92, DEEP_ROMANCE: 0.4 },
    });
    this.registerProfile('NOSTALGIC_WARMTH', DefaultEmotionProfile);
  }

  getProfile(key: string): EmotionProfileData {
    return this.profiles.get(key) || DefaultEmotionProfile;
  }

  registerProfile(key: string, profile: EmotionProfileData): void {
    this.profiles.set(key, profile);
  }
}
