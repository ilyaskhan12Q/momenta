import type { StoryManifestV1 } from '../contracts/StoryManifestV1';

export interface IManifestRepository {
  saveManifest(manifest: StoryManifestV1): Promise<void>;
  findByToken(linkToken: string): Promise<StoryManifestV1 | null>;
  findByExperienceId(experienceId: string): Promise<StoryManifestV1 | null>;
}

export const IManifestRepository = {};
