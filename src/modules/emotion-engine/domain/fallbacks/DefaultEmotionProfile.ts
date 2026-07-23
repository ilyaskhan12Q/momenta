import { EmotionProfileData } from '../contracts/ExperiencePresentationContract';

export const DefaultEmotionProfile: EmotionProfileData = {
  primaryEmotion: 'NOSTALGIC_WARMTH',
  secondaryEmotion: 'SOLACE_COMFORT',
  confidence: 0.85,
  valence: 0.6,
  arousal: 0.4,
  dominance: 0.5,
  intensity: 0.5,
  scores: {
    NOSTALGIC_WARMTH: 0.85,
    SOLACE_COMFORT: 0.6,
    DEEP_ROMANCE: 0.4,
    JOYFUL_BURST: 0.3,
  },
};
