import crypto from 'crypto';
import { Experience } from '../../../authoring/domain/entities/Experience';
import { ExperiencePresentationContract } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';
import { StoryManifestV1, ManifestSceneBeat } from '../contracts/StoryManifestV1';

export class StoryManifestCompiler {
  compile(
    experience: Experience,
    presentation: ExperiencePresentationContract,
    senderDisplayName = 'Anonymous'
  ): StoryManifestV1 {
    const manifestId = crypto.randomUUID();
    const publishedAt = new Date().toISOString();

    const scenes: ManifestSceneBeat[] = experience.scenes.map((scene) => ({
      sequenceOrder: scene.sequenceOrder,
      durationMs: scene.durationMs,
      transitionType: scene.transition,
      textBeat: scene.beats.join(' '),
    }));

    const rawPayload = JSON.stringify({
      experienceId: experience.id,
      linkToken: experience.accessToken?.value || '',
      scenes,
      presentation,
    });

    const checksum = crypto.createHash('sha256').update(rawPayload).digest('hex');

    return {
      manifestVersion: '1.0.0',
      manifestId,
      experienceId: experience.id,
      linkToken: experience.accessToken?.value || '',
      senderDisplayName,
      relationship: experience.relationship.value,
      occasion: experience.occasion.value,
      publishedAt,
      scenes,
      presentation,
      checksum,
    };
  }
}
