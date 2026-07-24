import { Experience } from '../../../authoring/domain/entities/Experience';
import type { ExperiencePresentationContract } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';
import type { StoryManifestV1, ManifestSceneBeat } from '../contracts/StoryManifestV1';

function computeChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
}

export class StoryManifestCompiler {
  compile(
    experience: Experience,
    presentation: ExperiencePresentationContract,
    senderDisplayName = 'Anonymous'
  ): StoryManifestV1 {
    const manifestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
    const publishedAt = new Date().toISOString();

    const scenes: ManifestSceneBeat[] = experience.scenes.map((scene) => ({
      sequenceOrder: scene.sequenceOrder,
      durationMs: scene.durationMs,
      transitionType: scene.transition,
      textBeat: scene.beats.map((b: any) => (typeof b === 'string' ? b : b.textPrompt || b.content || '')).join(' '),
    }));

    const rawPayload = JSON.stringify({
      experienceId: experience.id,
      linkToken: experience.accessToken?.value || '',
      scenes,
      presentation,
    });

    const checksum = computeChecksum(rawPayload);

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
