import { Experience } from '../../../modules/authoring/domain/entities/Experience';
import { IExperienceRepository } from '../../../modules/authoring/domain/repositories/IExperienceRepository';
import { StoryManifestV1 } from '../../../modules/story-manifest/domain/contracts/StoryManifestV1';
import { IManifestRepository } from '../../../modules/story-manifest/domain/repositories/IManifestRepository';

export class InMemoryExperienceStore implements IExperienceRepository, IManifestRepository {
  private static instance: InMemoryExperienceStore;
  private experiences: Map<string, Experience> = new Map();
  private manifestsByToken: Map<string, StoryManifestV1> = new Map();
  private manifestsById: Map<string, StoryManifestV1> = new Map();

  private constructor() {}

  public static getInstance(): InMemoryExperienceStore {
    if (!InMemoryExperienceStore.instance) {
      InMemoryExperienceStore.instance = new InMemoryExperienceStore();
    }
    return InMemoryExperienceStore.instance;
  }

  // IExperienceRepository
  public async save(experience: Experience): Promise<void> {
    this.experiences.set(experience.id, experience);
    if (experience.accessToken) {
      // also map by access token for convenience if needed
    }
  }

  public async findById(id: string): Promise<Experience | null> {
    return this.experiences.get(id) || null;
  }

  public async findByAccessToken(accessToken: string): Promise<Experience | null> {
    for (const exp of this.experiences.values()) {
      if (exp.accessToken?.value === accessToken) {
        return exp;
      }
    }
    return null;
  }

  // IManifestRepository
  public async saveManifest(manifest: StoryManifestV1): Promise<void> {
    this.manifestsByToken.set(manifest.linkToken, manifest);
    this.manifestsById.set(manifest.experienceId, manifest);
  }

  public async findByToken(linkToken: string): Promise<StoryManifestV1 | null> {
    return this.manifestsByToken.get(linkToken) || null;
  }

  public async findByExperienceId(experienceId: string): Promise<StoryManifestV1 | null> {
    return this.manifestsById.get(experienceId) || null;
  }

  public clear(): void {
    this.experiences.clear();
    this.manifestsByToken.clear();
    this.manifestsById.clear();
  }
}
