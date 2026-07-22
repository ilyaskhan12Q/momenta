import { describe, it, expect } from 'vitest';
import { ExperienceManifestCompiler } from '../../../../src/modules/story-generation/application/ExperienceManifestCompiler';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../../src/modules/authoring/domain/value-objects/OccasionType';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';
import { PresentationContract } from '../../../../src/modules/emotion-engine/domain/PresentationContract';

describe('ExperienceManifestCompiler', () => {
  it('should compile a valid Experience manifest and validate Zod schema', async () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;
    const exp = Experience.createDraft({ senderId: 'user-1', title: 'Test Story', relationship: rel, occasion: occ }).value;

    exp.appendScene(
      Scene.create({
        id: 's1',
        sequenceOrder: 1,
        durationMs: 3000,
        transition: 'FADE_UP',
        beats: [{ id: 'b1', type: 'HEADING', content: 'Hello' }],
      })
    );
    exp.appendScene(
      Scene.create({
        id: 's2',
        sequenceOrder: 2,
        durationMs: 4000,
        transition: 'PARALLAX_SLIDE',
        beats: [{ id: 'b2', type: 'QUOTE', content: 'World' }],
      })
    );
    exp.publish();

    const contract: PresentationContract = {
      presetId: 'DEEP_ROMANCE',
      colors: {
        background: '#000',
        surfaceGlass: '#111',
        primaryText: '#fff',
        secondaryText: '#ccc',
        accentGlow: '#8b5cf6',
        borderGlass: '#222',
      },
      typography: {
        headerFontFamily: 'Serif',
        bodyFontFamily: 'Sans',
        baseFontSizePx: 16,
        letterSpacing: '0',
      },
      shader: {
        fragmentShaderKey: 'shader.frag',
        speed: 1,
        noiseScale: 1,
        intensity: 1,
      },
      audio: {
        stemKey: 'audio.aac',
        bpm: 60,
        fadeInSeconds: 2,
        lowPassCutoffHz: 10000,
      },
    };

    const compiler = new ExperienceManifestCompiler();
    const manifestRes = compiler.compile(exp, contract);

    expect(manifestRes.isSuccess).toBe(true);
    const manifest = manifestRes.value;
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.experienceId).toBe(exp.id);
    expect(manifest.timeline).toHaveLength(2);
    expect(manifest.theme.presetId).toBe('DEEP_ROMANCE');
  });
});
