import { Experience } from '../../domain/entities/Experience';
import { RelationshipIntent } from '../../domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../domain/value-objects/OccasionType';
import { InteractionGesture } from '../../domain/value-objects/InteractionGesture';
import { LinkToken } from '../../domain/value-objects/LinkToken';
import { Scene, SceneBeat } from '../../domain/models/Scene';

export interface SupabaseExperienceRow {
  id: string;
  sender_id: string;
  title: string;
  relationship: string;
  occasion: string;
  gesture: string;
  status: string;
  burn_on_read: boolean;
  access_token: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseSceneRow {
  id: string;
  story_id: string;
  sequence_order: number;
  duration_ms: number;
  transition: string;
  beats: SceneBeat[];
  created_at: string;
}

export class ExperienceMapper {
  public static toDomain(expRow: SupabaseExperienceRow, sceneRows: SupabaseSceneRow[]): Experience {
    const relationship = RelationshipIntent.create(expRow.relationship).value;
    const occasion = OccasionType.create(expRow.occasion).value;
    const gesture = InteractionGesture.create(expRow.gesture as any);
    const accessToken = expRow.access_token ? LinkToken.create(expRow.access_token) : undefined;

    const scenes = sceneRows
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .map((row) =>
        Scene.create({
          id: row.id,
          sequenceOrder: row.sequence_order,
          durationMs: row.duration_ms,
          transition: row.transition as any,
          beats: row.beats,
        })
      );

    return Experience.reconstitute(
      {
        senderId: expRow.sender_id,
        title: expRow.title,
        relationship,
        occasion,
        gesture,
        status: expRow.status as any,
        scenes,
        burnOnRead: expRow.burn_on_read,
        accessToken,
        publishedAt: expRow.published_at ? new Date(expRow.published_at) : undefined,
        createdAt: new Date(expRow.created_at),
        updatedAt: new Date(expRow.updated_at),
      },
      expRow.id
    );
  }

  public static toPersistence(experience: Experience): { experienceRow: SupabaseExperienceRow; sceneRows: SupabaseSceneRow[] } {
    const experienceRow: SupabaseExperienceRow = {
      id: experience.id,
      sender_id: experience.senderId,
      title: experience.title,
      relationship: experience.relationship.value,
      occasion: experience.occasion.value,
      gesture: experience.gesture.value,
      status: experience.status,
      burn_on_read: experience.burnOnRead,
      access_token: experience.accessToken ? experience.accessToken.value : null,
      published_at: experience.status === 'PUBLISHED' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const sceneRows: SupabaseSceneRow[] = experience.scenes.map((scene) => ({
      id: scene.id,
      story_id: experience.id,
      sequence_order: scene.sequenceOrder,
      duration_ms: scene.durationMs,
      transition: scene.transition,
      beats: scene.beats,
      created_at: new Date().toISOString(),
    }));

    return { experienceRow, sceneRows };
  }
}
