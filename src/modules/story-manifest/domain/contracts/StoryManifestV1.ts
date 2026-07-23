import type { ExperiencePresentationContract } from '../../../emotion-engine/domain/contracts/ExperiencePresentationContract';

export interface ManifestSceneBeat {
  sequenceOrder: number;
  durationMs: number;
  transitionType: string;
  textBeat: string;
}

export interface StoryManifestV1 {
  manifestVersion: '1.0.0';
  manifestId: string;
  experienceId: string;
  linkToken: string;
  senderDisplayName: string;
  relationship: string;
  occasion: string;
  publishedAt: string;
  scenes: ManifestSceneBeat[];
  presentation: ExperiencePresentationContract;
  checksum: string;
}

export const StoryManifestV1 = {};
