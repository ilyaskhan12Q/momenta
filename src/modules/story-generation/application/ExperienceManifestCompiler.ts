import { Experience } from '../../authoring/domain/entities/Experience';
import { PresentationContract } from '../../emotion-engine/domain/PresentationContract';
import { ExperienceManifestV1, experienceManifestV1Schema } from '../domain/ExperienceManifestV1';
import { Result } from '../../../shared/domain/Result';
import { ValidationError } from '../../../shared/errors/AppError';

export class ExperienceManifestCompiler {
  public compile(
    experience: Experience,
    contract: PresentationContract
  ): Result<ExperienceManifestV1, ValidationError> {
    if (!experience.accessToken) {
      return Result.fail(new ValidationError('Cannot compile manifest for unpublished experience without access token'));
    }

    const rawManifest: ExperienceManifestV1 = {
      version: '1.0.0',
      experienceId: experience.id,
      accessToken: experience.accessToken.value,
      createdTimestamp: Date.now(),
      metadata: {
        title: experience.title,
        relationship: experience.relationship.value,
        occasion: experience.occasion.value,
      },
      theme: contract,
      timeline: experience.scenes.map((scene) => ({
        sceneId: scene.id,
        sequenceOrder: scene.sequenceOrder,
        durationMs: scene.durationMs,
        transition: scene.transition,
        beats: scene.beats.map((beat) => ({
          id: beat.id,
          type: beat.type,
          content: beat.content,
        })),
      })),
      finalGesture: {
        gestureType: experience.gesture.value,
      },
    };

    const parseRes = experienceManifestV1Schema.safeParse(rawManifest);
    if (!parseRes.success) {
      return Result.fail(new ValidationError(`Manifest validation error: ${parseRes.error.message}`));
    }

    return Result.ok(parseRes.data);
  }
}
