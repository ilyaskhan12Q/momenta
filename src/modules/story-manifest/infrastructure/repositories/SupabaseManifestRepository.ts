import type { SupabaseClient } from '@supabase/supabase-js';
import type { IManifestRepository } from '../../domain/repositories/IManifestRepository';
import type { StoryManifestV1 } from '../../domain/contracts/StoryManifestV1';
import { DatabaseError } from '../../../../shared/errors/AppError';

export class SupabaseManifestRepository implements IManifestRepository {
  constructor(private readonly client: SupabaseClient) {}

  async saveManifest(manifest: StoryManifestV1): Promise<void> {
    const { error } = await this.client
      .from('experiences')
      .update({
        manifest_json: manifest,
        status: 'PUBLISHED',
        published_at: manifest.publishedAt,
      })
      .eq('id', manifest.experienceId);

    if (error) {
      throw new DatabaseError(`Failed to save story manifest: ${error.message}`);
    }
  }

  async findByToken(linkToken: string): Promise<StoryManifestV1 | null> {
    const { data, error } = await this.client
      .from('experiences')
      .select('manifest_json')
      .eq('access_token', linkToken)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(`Failed to fetch manifest by token: ${error.message}`);
    }
    if (!data || !data.manifest_json) return null;

    return data.manifest_json as StoryManifestV1;
  }

  async findByExperienceId(experienceId: string): Promise<StoryManifestV1 | null> {
    const { data, error } = await this.client
      .from('experiences')
      .select('manifest_json')
      .eq('id', experienceId)
      .maybeSingle();

    if (error) {
      throw new DatabaseError(`Failed to fetch manifest by experienceId: ${error.message}`);
    }
    if (!data || !data.manifest_json) return null;

    return data.manifest_json as StoryManifestV1;
  }
}
