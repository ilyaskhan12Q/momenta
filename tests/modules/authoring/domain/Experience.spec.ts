import { describe, it, expect } from 'vitest';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';

describe('Experience Aggregate Root', () => {
  it('should create an Experience draft and emit ExperienceCreatedEvent', () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;

    const expRes = Experience.createDraft({
      senderId: 'user-100',
      title: 'Decade of Memories',
      relationship: rel,
      occasion: occ,
    });

    expect(expRes.isSuccess).toBe(true);
    const exp = expRes.value;
    expect(exp.status).toBe('DRAFT');
    expect(exp.domainEvents).toHaveLength(1);
    expect(exp.domainEvents[0].constructor.name).toBe('ExperienceCreatedEvent');
  });

  it('should append scenes and transition lifecycle upon publishing', () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;
    const exp = Experience.createDraft({
      senderId: 'user-100',
      title: 'Decade of Memories',
      relationship: rel,
      occasion: occ,
    }).value;

    const s1 = Scene.create({
      id: 's1',
      sequenceOrder: 1,
      durationMs: 3000,
      transition: 'FADE_UP',
      beats: [{ id: 'b1', type: 'HEADING', content: 'Intro' }],
    });
    const s2 = Scene.create({
      id: 's2',
      sequenceOrder: 2,
      durationMs: 4000,
      transition: 'PARALLAX_SLIDE',
      beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax text' }],
    });

    exp.appendScene(s1);
    exp.appendScene(s2);

    expect(exp.scenes).toHaveLength(2);
    expect(exp.status).toBe('STORY_COMPOSED');

    const pubRes = exp.publish();
    expect(pubRes.isSuccess).toBe(true);
    expect(exp.status).toBe('PUBLISHED');
    expect(exp.accessToken).toBeDefined();
    expect(exp.domainEvents.some((e) => e.constructor.name === 'ExperiencePublishedEvent')).toBe(true);
  });
});
