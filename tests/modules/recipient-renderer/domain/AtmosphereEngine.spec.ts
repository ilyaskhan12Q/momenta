import { describe, it, expect } from 'vitest';
import { AtmosphereEngine } from '../../../../src/modules/recipient-renderer/domain/AtmosphereEngine';

describe('AtmosphereEngine', () => {
  it('should return default ROMANTIC atmosphere profile when relationship is undefined or unknown', () => {
    const profile = AtmosphereEngine.getProfile(undefined);
    expect(profile.shaderKey).toBe('EMBERS');
    expect(profile.particleType).toBe('embers');

    const unknownProfile = AtmosphereEngine.getProfile('UNKNOWN');
    expect(unknownProfile.shaderKey).toBe('EMBERS');
  });

  it('should return specific atmosphere profiles for preset relationship types', () => {
    const romantic = AtmosphereEngine.getProfile('ROMANTIC');
    expect(romantic.shaderKey).toBe('EMBERS');
    expect(romantic.primaryColor).toBe('#e63956');

    const platonic = AtmosphereEngine.getProfile('PLATONIC');
    expect(platonic.shaderKey).toBe('STARLIGHT');
    expect(platonic.primaryColor).toBe('#f59e0b');

    const family = AtmosphereEngine.getProfile('FAMILY');
    expect(family.shaderKey).toBe('WATERCOLOR');

    const professional = AtmosphereEngine.getProfile('PROFESSIONAL');
    expect(professional.shaderKey).toBe('AURORA');
  });

  it('should return state modifiers matching lifecycle states', () => {
    const unopened = AtmosphereEngine.getStateModifier('UNOPENED');
    expect(unopened.speedMultiplier).toBeLessThan(1.0);

    const unlocking = AtmosphereEngine.getStateModifier('UNLOCKING');
    expect(unlocking.speedMultiplier).toBeGreaterThan(1.5);
    expect(unlocking.intensityMultiplier).toBeGreaterThan(1.0);

    const playing = AtmosphereEngine.getStateModifier('PLAYING');
    expect(playing.speedMultiplier).toBe(1.0);
  });
});
