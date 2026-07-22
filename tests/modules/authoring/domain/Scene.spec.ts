import { describe, it, expect } from 'vitest';
import { Scene, SceneBeat } from '../../../../src/modules/authoring/domain/models/Scene';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { InteractionGesture } from '../../../../src/modules/authoring/domain/value-objects/InteractionGesture';
import { LinkToken } from '../../../../src/modules/authoring/domain/value-objects/LinkToken';

describe('Authoring Domain — Timeline Scenes & Value Objects', () => {
  it('should construct a valid timeline Scene with beats', () => {
    const beats: SceneBeat[] = [
      { id: 'b1', type: 'HEADING', content: 'To my beloved' },
      { id: 'b2', type: 'QUOTE', content: 'A timeless memory' },
    ];

    const scene = Scene.create({
      id: 'scene-1',
      sequenceOrder: 1,
      durationMs: 4000,
      transition: 'FADE_UP',
      beats,
    });

    expect(scene.id).toBe('scene-1');
    expect(scene.sequenceOrder).toBe(1);
    expect(scene.durationMs).toBe(4000);
    expect(scene.transition).toBe('FADE_UP');
    expect(scene.beats).toHaveLength(2);
  });

  it('should validate relationship intent categories', () => {
    const relRes = RelationshipIntent.create('PARTNER');
    expect(relRes.isSuccess).toBe(true);
    expect(relRes.value.value).toBe('PARTNER');

    const invalidRes = RelationshipIntent.create('INVALID_RELATION' as any);
    expect(invalidRes.isFailure).toBe(true);
    expect(invalidRes.error.message).toContain('Invalid relationship category');
  });

  it('should validate occasion type categories', () => {
    const occRes = OccasionType.create('ANNIVERSARY');
    expect(occRes.isSuccess).toBe(true);
    expect(occRes.value.value).toBe('ANNIVERSARY');

    const invalidRes = OccasionType.create('INVALID_OCCASION' as any);
    expect(invalidRes.isFailure).toBe(true);
  });

  it('should create interaction gesture defaults and link tokens', () => {
    const gesture = InteractionGesture.create('WAX_SEAL');
    expect(gesture.value).toBe('WAX_SEAL');

    const token = LinkToken.create();
    expect(token.value).toHaveLength(16);
  });
});
