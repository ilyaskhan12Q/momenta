import { Experience } from '../../../authoring/domain/entities/Experience';
import { RelationshipIntent } from '../../../authoring/domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../../authoring/domain/value-objects/OccasionType';
import { Scene } from '../../../authoring/domain/models/Scene';
import { EmotionPipelineOrchestrator } from '../../../emotion-engine/domain/EmotionPipelineOrchestrator';
import { StoryManifestCompiler } from '../../domain/compiler/StoryManifestCompiler';
import type { StoryManifestV1 } from '../../domain/contracts/StoryManifestV1';

const experiencesMap = new Map<string, Experience>();
const manifestsMap = new Map<string, StoryManifestV1>();

export class LocalExperienceService {
  private orchestrator = new EmotionPipelineOrchestrator();
  private compiler = new StoryManifestCompiler();

  createDraft(senderId: string, title: string, relationshipStr: string, occasionStr: string): string {
    const relRes = RelationshipIntent.create(relationshipStr);
    const relationship = relRes.isSuccess ? relRes.value : RelationshipIntent.create('OTHER').value;

    const occRes = OccasionType.create(occasionStr);
    const occasion = occRes.isSuccess ? occRes.value : OccasionType.create('JUST_BECAUSE').value;


    const exp = Experience.createDraft({
      senderId,
      title,
      relationship,
      occasion,
    }).value;

    experiencesMap.set(exp.id, exp);
    return exp.id;
  }

  appendScene(experienceId: string, sequenceOrder: number, durationMs: number, transition: string, beats: string[]): void {
    const exp = experiencesMap.get(experienceId);
    if (!exp) throw new Error(`Experience ${experienceId} not found in local store`);

    const scene = Scene.create({ sequenceOrder, durationMs, transition, beats });
    exp.appendScene(scene);
  }

  async publish(experienceId: string, senderDisplayName = 'Anonymous'): Promise<StoryManifestV1> {
    const exp = experiencesMap.get(experienceId);
    if (!exp) throw new Error(`Experience ${experienceId} not found in local store`);

    exp.publish();

    const textBeats = exp.scenes.flatMap((s) => s.beats);
    const presentation = await this.orchestrator.execute({
      experienceId: exp.id,
      senderId: exp.senderId,
      relationship: exp.relationship.value,
      occasion: exp.occasion.value,
      gestureType: exp.gesture.value,
      textBeats: textBeats.length > 0 ? textBeats : ['A beautiful memory shared.'],
    });

    const manifest = this.compiler.compile(exp, presentation, senderDisplayName);
    manifestsMap.set(manifest.linkToken, manifest);
    manifestsMap.set(manifest.manifestId, manifest);

    // Save to localStorage if available
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`momenta_manifest_${manifest.linkToken}`, JSON.stringify(manifest));
      } catch {
        // localStorage unavailable
      }
    }

    return manifest;
  }

  getManifest(token: string): StoryManifestV1 | null {
    if (manifestsMap.has(token)) {
      return manifestsMap.get(token)!;
    }

    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`momenta_manifest_${token}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          manifestsMap.set(token, parsed);
          return parsed;
        }
      } catch {
        // Cache miss
      }
    }

    return null;
  }
}

export const localExperienceService = new LocalExperienceService();
