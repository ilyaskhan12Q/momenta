import { SupabaseClient } from '@supabase/supabase-js';
import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { ExperienceMapper, SupabaseExperienceRow, SupabaseSceneRow } from '../mappers/ExperienceMapper';
import { DomainEventBus } from '../../../../shared/domain/DomainEventBus';

export class SupabaseExperienceRepository implements IExperienceRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async findById(id: string): Promise<Experience | null> {
    const { data: expData, error: expErr } = await this.client
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();

    if (expErr || !expData) return null;

    const { data: scenesData } = await this.client
      .from('scenes')
      .select('*')
      .eq('story_id', id)
      .order('sequence_order', { ascending: true });

    return ExperienceMapper.toDomain(expData as SupabaseExperienceRow, (scenesData || []) as SupabaseSceneRow[]);
  }

  public async findByAccessToken(token: string): Promise<Experience | null> {
    const { data: expData, error: expErr } = await this.client
      .from('experiences')
      .select('*')
      .eq('access_token', token)
      .single();

    if (expErr || !expData) return null;

    const { data: scenesData } = await this.client
      .from('scenes')
      .select('*')
      .eq('story_id', expData.id)
      .order('sequence_order', { ascending: true });

    return ExperienceMapper.toDomain(expData as SupabaseExperienceRow, (scenesData || []) as SupabaseSceneRow[]);
  }

  public async save(experience: Experience): Promise<void> {
    const { experienceRow, sceneRows } = ExperienceMapper.toPersistence(experience);

    const { error: expErr } = await this.client.from('experiences').upsert(experienceRow);
    if (expErr) throw expErr;

    if (sceneRows.length > 0) {
      const { error: sceneErr } = await this.client.from('scenes').upsert(sceneRows);
      if (sceneErr) throw sceneErr;
    }

    await DomainEventBus.dispatchEventsForAggregate(experience);
  }
}
