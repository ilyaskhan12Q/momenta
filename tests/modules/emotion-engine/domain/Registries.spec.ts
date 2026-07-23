import { describe, it, expect } from 'vitest';
import { EmotionRegistry } from '../../../../src/modules/emotion-engine/domain/registries/EmotionRegistry';
import { TypographyRegistry } from '../../../../src/modules/emotion-engine/domain/registries/TypographyRegistry';
import { ShaderRegistry } from '../../../../src/modules/emotion-engine/domain/registries/ShaderRegistry';
import { DefaultEmotionProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultEmotionProfile';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('Strategy Registries & Fallback Profiles', () => {
  it('should return emotion definitions from EmotionRegistry', () => {
    const registry = new EmotionRegistry();
    const profile = registry.getProfile('DEEP_ROMANCE');
    expect(profile).toBeDefined();
    expect(profile?.primaryEmotion).toBe('DEEP_ROMANCE');
  });

  it('should fallback to DefaultEmotionProfile if key is unknown', () => {
    const registry = new EmotionRegistry();
    const profile = registry.getProfile('UNKNOWN_EMOTION');
    expect(profile).toEqual(DefaultEmotionProfile);
  });

  it('should provide default presentation profile fallback', () => {
    expect(DefaultPresentationProfile.colors.background).toBeDefined();
    expect(DefaultPresentationProfile.typography.headerFontFamily).toBeDefined();
    expect(DefaultPresentationProfile.shader.fragmentShaderKey).toBeDefined();
  });
});
