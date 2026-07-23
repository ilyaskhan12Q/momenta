import { describe, it, expect, vi } from 'vitest';
import { SupabaseManifestRepository } from '../../../../src/modules/story-manifest/infrastructure/repositories/SupabaseManifestRepository';
import { StoryManifestV1 } from '../../../../src/modules/story-manifest/domain/contracts/StoryManifestV1';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('SupabaseManifestRepository', () => {
  it('should save and find story manifest by token', async () => {
    const manifest: StoryManifestV1 = {
      manifestVersion: '1.0.0',
      manifestId: 'man-100',
      experienceId: 'exp-100',
      linkToken: 'token12345678901',
      senderDisplayName: 'Alex',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
      publishedAt: new Date().toISOString(),
      scenes: [{ sequenceOrder: 1, durationMs: 5000, transitionType: 'FADE_SLIDE', textBeat: 'Beat 1' }],
      presentation: DefaultPresentationProfile,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { manifest_json: manifest },
              error: null,
            }),
          }),
        }),
      }),
    };

    const repo = new SupabaseManifestRepository(mockSupabase as any);
    await repo.saveManifest(manifest);
    expect(mockSupabase.from).toHaveBeenCalledWith('experiences');

    const result = await repo.findByToken('token12345678901');
    expect(result).toBeDefined();
    expect(result?.manifestId).toBe('man-100');
  });
});
