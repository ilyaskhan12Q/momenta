import { describe, it, expect } from 'vitest';
import { Story } from '../../../../src/modules/authoring/domain/entities/Story';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';
import { StoryLengthSpecification } from '../../../../src/modules/authoring/domain/specifications/StoryLengthSpecification';
import { PublishingPolicy } from '../../../../src/modules/authoring/domain/policies/PublishingPolicy';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';

describe('Authoring Domain — Policies & Specifications', () => {
  it('should enforce StoryLengthSpecification max text length of 2,500 characters', () => {
    const longText = 'a'.repeat(2501);
    const s1 = Scene.create({
      id: 's1',
      sequenceOrder: 1,
      durationMs: 3000,
      transition: 'FADE_UP',
      beats: [{ id: 'b1', type: 'PARAGRAPH', content: longText }],
    });
    const story = Story.create({ title: 'Long Story', scenes: [s1] });

    const spec = new StoryLengthSpecification();
    expect(spec.isSatisfiedBy(story)).toBe(false);
  });

  it('should evaluate PublishingPolicy rules for experience publication', () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;
    const exp = Experience.createDraft({ senderId: 'u1', title: 'Test', relationship: rel, occasion: occ }).value;

    const policy = new PublishingPolicy();
    expect(policy.canPublish(exp).isFailure).toBe(true);

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
      beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax' }],
    });

    exp.appendScene(s1);
    exp.appendScene(s2);

    expect(policy.canPublish(exp).isSuccess).toBe(true);
  });
});
