import { describe, it, expect } from 'vitest';
import { ExperienceMapper } from '../../../../src/modules/authoring/infrastructure/mappers/ExperienceMapper';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';

describe('ExperienceMapper Infrastructure', () => {
  it('should perform bidirectional mapping between Experience domain aggregate and database rows', () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;
    const exp = Experience.createDraft({ senderId: 'u-100', title: 'Mapper Test', relationship: rel, occasion: occ }).value;

    const s1 = Scene.create({
      id: 's-1',
      sequenceOrder: 1,
      durationMs: 3000,
      transition: 'FADE_UP',
      beats: [{ id: 'b-1', type: 'HEADING', content: 'Title' }],
    });
    exp.appendScene(s1);

    const persistence = ExperienceMapper.toPersistence(exp);
    expect(persistence.experienceRow.title).toBe('Mapper Test');
    expect(persistence.sceneRows).toHaveLength(1);

    const reconstituted = ExperienceMapper.toDomain(persistence.experienceRow, persistence.sceneRows);
    expect(reconstituted.id).toBe(exp.id);
    expect(reconstituted.title).toBe('Mapper Test');
    expect(reconstituted.scenes).toHaveLength(1);
  });
});
