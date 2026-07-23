import { describe, it, expect, vi } from 'vitest';
import { CompileAndPublishManifestUseCase } from '../../../../src/modules/story-manifest/application/use-cases/CompileAndPublishManifestUseCase';
import { GetPublishedManifestUseCase } from '../../../../src/modules/story-manifest/application/use-cases/GetPublishedManifestUseCase';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';

describe('Story Manifest Application Use Cases', () => {
  it('should compile and publish experience manifest using CompileAndPublishManifestUseCase', async () => {
    const exp = Experience.createDraft({
      senderId: 'user-10',
      title: 'Anniversary Story',
      relationship: RelationshipIntent.create('PARTNER').value,
      occasion: OccasionType.create('ANNIVERSARY').value,
    }).value;

    exp.appendScene(Scene.create({ sequenceOrder: 1, durationMs: 5000, transition: 'FADE_SLIDE', beats: ['Beat 1'] }));
    exp.appendScene(Scene.create({ sequenceOrder: 2, durationMs: 5000, transition: 'FADE_SLIDE', beats: ['Beat 2'] }));

    const mockExpRepo = {
      findById: vi.fn().mockResolvedValue(exp),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const mockManifestRepo = {
      saveManifest: vi.fn().mockResolvedValue(undefined),
      findByToken: vi.fn().mockResolvedValue(null),
      findByExperienceId: vi.fn().mockResolvedValue(null),
    };

    const useCase = new CompileAndPublishManifestUseCase(mockExpRepo as any, mockManifestRepo as any);
    const result = await useCase.execute({ experienceId: exp.id, senderId: 'user-10', senderDisplayName: 'Alex' });

    expect(result.isSuccess).toBe(true);
    expect(result.value.manifestVersion).toBe('1.0.0');
    expect(mockManifestRepo.saveManifest).toHaveBeenCalled();
  });

  it('should fetch published manifest using GetPublishedManifestUseCase', async () => {
    const mockManifest = { manifestVersion: '1.0.0', manifestId: 'man-1' };
    const mockManifestRepo = {
      findByToken: vi.fn().mockResolvedValue(mockManifest),
      saveManifest: vi.fn(),
      findByExperienceId: vi.fn(),
    };

    const useCase = new GetPublishedManifestUseCase(mockManifestRepo as any);
    const result = await useCase.execute('validtoken123456');

    expect(result.isSuccess).toBe(true);
    expect(result.value.manifestId).toBe('man-1');
  });
});
