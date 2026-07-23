import { describe, it, expect } from 'vitest';
import { StoryManifestCompiler } from '../../../../src/modules/story-manifest/domain/compiler/StoryManifestCompiler';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { InteractionGesture } from '../../../../src/modules/authoring/domain/value-objects/InteractionGesture';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';
import { DefaultPresentationProfile } from '../../../../src/modules/emotion-engine/domain/fallbacks/DefaultPresentationProfile';

describe('StoryManifestCompiler', () => {
  it('should compile Experience aggregate root into a valid StoryManifestV1 with SHA-256 checksum', () => {
    const relationship = RelationshipIntent.create('PARTNER').value;
    const occasion = OccasionType.create('ANNIVERSARY').value;
    const gesture = InteractionGesture.create('WAX_SEAL').value;

    const exp = Experience.createDraft({
      senderId: 'user-123',
      title: 'Our Love Story',
      relationship,
      occasion,
      gesture,
      burnOnRead: false,
    }).value;

    exp.appendScene(Scene.create({ sequenceOrder: 1, durationMs: 5000, transition: 'FADE_SLIDE', beats: ['Beat 1'] }));
    exp.appendScene(Scene.create({ sequenceOrder: 2, durationMs: 6000, transition: 'FADE_SLIDE', beats: ['Beat 2'] }));

    const compiler = new StoryManifestCompiler();
    const manifest = compiler.compile(exp, DefaultPresentationProfile, 'Alex');

    expect(manifest.manifestVersion).toBe('1.0.0');
    expect(manifest.experienceId).toBe(exp.id);
    expect(manifest.senderDisplayName).toBe('Alex');
    expect(manifest.scenes.length).toBe(2);
    expect(manifest.checksum).toBeDefined();
    expect(manifest.checksum.length).toBe(64); // SHA-256 hex string length
  });
});
