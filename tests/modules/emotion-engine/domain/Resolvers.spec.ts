import { describe, it, expect } from 'vitest';
import { PresentationResolver } from '../../../../src/modules/emotion-engine/domain/resolvers/PresentationResolver';
import { DefaultEmotionProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultEmotionProfile';

describe('Presentation Resolvers', () => {
  it('should resolve full presentation contract tokens from emotion profile and context', () => {
    const resolver = new PresentationResolver();
    const contract = resolver.resolve({
      experienceId: 'exp-1',
      senderId: 'user-1',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
      textBeats: ['I love you so much.'],
      analysisResult: {
        primaryEmotion: 'DEEP_ROMANCE',
        secondaryEmotion: 'NOSTALGIC_WARMTH',
        confidence: 0.9,
        emotionScores: { DEEP_ROMANCE: 0.9 },
        valence: 0.8,
        arousal: 0.7,
        dominance: 0.6,
      },
      intensityScore: 0.8,
      detectedLanguage: 'en',
    });

    expect(contract.colors.accentGlow).toBeDefined();
    expect(contract.typography.headerFontFamily).toBeDefined();
    expect(contract.shader.fragmentShaderKey).toBeDefined();
    expect(contract.gesture.gestureType).toBeDefined();
  });
});
