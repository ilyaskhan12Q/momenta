import { describe, it, expect } from 'vitest';
import { ManifestValidationSpec } from '../../../../src/modules/story-manifest/domain/specifications/ManifestValidationSpec';
import { StoryManifestV1 } from '../../../../src/modules/story-manifest/domain/contracts/StoryManifestV1';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('ManifestValidationSpec', () => {
  it('should validate a complete and correct StoryManifestV1', () => {
    const validManifest: StoryManifestV1 = {
      manifestVersion: '1.0.0',
      manifestId: 'man-100',
      experienceId: 'exp-100',
      linkToken: 'token12345678901',
      senderDisplayName: 'Alex',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
      publishedAt: new Date().toISOString(),
      scenes: [
        { sequenceOrder: 1, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 1' },
        { sequenceOrder: 2, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 2' },
      ],
      presentation: DefaultPresentationProfile,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };

    const spec = new ManifestValidationSpec();
    const result = spec.isSatisfiedBy(validManifest);
    expect(result.isSuccess).toBe(true);
  });

  it('should return failure if manifestVersion is invalid', () => {
    const invalidManifest: any = {
      manifestVersion: '2.0.0',
      scenes: [],
    };
    const spec = new ManifestValidationSpec();
    const result = spec.isSatisfiedBy(invalidManifest);
    expect(result.isFailure).toBe(true);
  });
});
