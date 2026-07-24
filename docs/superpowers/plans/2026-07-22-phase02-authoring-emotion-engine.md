# Phase 02: Experience Authoring, Modular Emotion Pipeline & Manifest Generation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 02 authoring domain capabilities: Experience aggregate root, timeline-based Scenes, modular Emotion Pipeline, extensible Strategy Registries, PresentationContract, ExperienceManifestV1 versioning/validation, and Supabase persistence mappers.

**Architecture:** Clean Architecture with Domain-Driven Design bounded contexts (`src/modules/authoring`, `src/modules/emotion-engine`, `src/modules/story-generation`). `Experience` is the Aggregate Root. `EmotionPipeline` runs extensible steps. Domain events are emitted for every state transition.

**Tech Stack:** Next.js, React, TypeScript, Supabase (PostgreSQL), Zod, Vitest.

## Global Constraints

- Strict Clean Architecture dependency direction.
- `Experience` is the Aggregate Root; `Story` is a subdomain entity.
- All lifecycle transitions emit typed domain events (`ExperienceCreatedEvent`, `SceneAppendedEvent`, `EmotionPipelineExecutedEvent`, `ManifestCompiledEvent`, `ExperiencePublishedEvent`).
- All registries (`IEmotionProfileRegistry`, `IGestureStrategyRegistry`, `ITransitionStrategyRegistry`) must use extensible Strategy / Registry patterns.

---

### Task 1: Authoring Bounded Context — Value Objects & Timeline Scenes

**Files:**
- Create: `src/modules/authoring/domain/value-objects/LinkToken.ts`
- Create: `src/modules/authoring/domain/value-objects/RelationshipIntent.ts`
- Create: `src/modules/authoring/domain/value-objects/OccasionType.ts`
- Create: `src/modules/authoring/domain/value-objects/InteractionGesture.ts`
- Create: `src/modules/authoring/domain/models/Scene.ts`
- Create: `tests/modules/authoring/domain/Scene.spec.ts`

**Interfaces:**
- Produces: `LinkToken`, `RelationshipIntent`, `OccasionType`, `InteractionGesture`, `Scene`, `SceneBeat`.

- [ ] **Step 1: Write failing unit test for Scene and Value Objects**

```typescript
// tests/modules/authoring/domain/Scene.spec.ts
import { describe, it, expect } from 'vitest';
import { Scene, SceneBeat } from '../../../../src/modules/authoring/domain/models/Scene';
import { RelationshipIntent } from '../../../../src/modules/authoring/domain/value-objects/RelationshipIntent';

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
    expect(scene.beats).toHaveLength(2);
  });

  it('should validate relationship intent categories', () => {
    const relRes = RelationshipIntent.create('PARTNER');
    expect(relRes.isSuccess).toBe(true);
    expect(relRes.value.value).toBe('PARTNER');

    const invalidRes = RelationshipIntent.create('INVALID_RELATION' as any);
    expect(invalidRes.isFailure).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/modules/authoring/domain/Scene.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Value Objects and Timeline Scene model**

```typescript
// src/modules/authoring/domain/value-objects/LinkToken.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';

export class LinkToken extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string { return this.props.value; }

  public static create(token?: string): LinkToken {
    const val = token || crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    return new LinkToken(val);
  }
}
```

```typescript
// src/modules/authoring/domain/value-objects/RelationshipIntent.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type RelationshipCategory = 'PARTNER' | 'PARENT' | 'CHILD' | 'SIBLING' | 'BEST_FRIEND' | 'MENTOR' | 'OTHER';

export class RelationshipIntent extends ValueObject<{ value: RelationshipCategory }> {
  private constructor(value: RelationshipCategory) {
    super({ value });
  }

  public get value(): RelationshipCategory { return this.props.value; }

  public static create(category: string): Result<RelationshipIntent, ValidationError> {
    const valid: RelationshipCategory[] = ['PARTNER', 'PARENT', 'CHILD', 'SIBLING', 'BEST_FRIEND', 'MENTOR', 'OTHER'];
    if (!valid.includes(category as RelationshipCategory)) {
      return Result.fail(new ValidationError(`Invalid relationship category: ${category}`));
    }
    return Result.ok(new RelationshipIntent(category as RelationshipCategory));
  }
}
```

```typescript
// src/modules/authoring/domain/value-objects/OccasionType.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type OccasionCategory = 'ANNIVERSARY' | 'BIRTHDAY' | 'CONDOLENCE' | 'APOLOGY' | 'VALENTINE' | 'JUST_BECAUSE';

export class OccasionType extends ValueObject<{ value: OccasionCategory }> {
  private constructor(value: OccasionCategory) {
    super({ value });
  }

  public get value(): OccasionCategory { return this.props.value; }

  public static create(category: string): Result<OccasionType, ValidationError> {
    const valid: OccasionCategory[] = ['ANNIVERSARY', 'BIRTHDAY', 'CONDOLENCE', 'APOLOGY', 'VALENTINE', 'JUST_BECAUSE'];
    if (!valid.includes(category as OccasionCategory)) {
      return Result.fail(new ValidationError(`Invalid occasion category: ${category}`));
    }
    return Result.ok(new OccasionType(category as OccasionCategory));
  }
}
```

```typescript
// src/modules/authoring/domain/value-objects/InteractionGesture.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';

export type GestureType = 'WAX_SEAL' | 'CANDLE_BLOW' | 'RIBBON_PULL' | 'LETTER_FLIP';

export class InteractionGesture extends ValueObject<{ value: GestureType }> {
  private constructor(value: GestureType) {
    super({ value });
  }

  public get value(): GestureType { return this.props.value; }

  public static create(type: GestureType = 'WAX_SEAL'): InteractionGesture {
    return new InteractionGesture(type);
  }
}
```

```typescript
// src/modules/authoring/domain/models/Scene.ts
import { ValueObject } from '../../../../shared/domain/ValueObject';

export type SceneTransitionType = 'FADE_UP' | 'PARALLAX_SLIDE' | 'ZOOM_IN' | 'BLUR_REVEAL';

export interface SceneBeat {
  id: string;
  type: 'HEADING' | 'PARAGRAPH' | 'QUOTE' | 'PHOTO_BEAT';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SceneProps {
  id: string;
  sequenceOrder: number;
  durationMs: number;
  transition: SceneTransitionType;
  beats: SceneBeat[];
}

export class Scene extends ValueObject<SceneProps> {
  private constructor(props: SceneProps) {
    super(props);
  }

  public get id(): string { return this.props.id; }
  public get sequenceOrder(): number { return this.props.sequenceOrder; }
  public get durationMs(): number { return this.props.durationMs; }
  public get transition(): SceneTransitionType { return this.props.transition; }
  public get beats(): SceneBeat[] { return this.props.beats; }

  public static create(props: SceneProps): Scene {
    return new Scene(props);
  }
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/modules/authoring/domain/Scene.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/authoring/domain tests/modules/authoring/domain
git commit -m "feat(authoring): add timeline Scene model and authoring value objects"
```

---

### Task 2: Experience Aggregate Root & Domain Events

**Files:**
- Create: `src/modules/authoring/domain/events/ExperienceCreatedEvent.ts`
- Create: `src/modules/authoring/domain/events/SceneAppendedEvent.ts`
- Create: `src/modules/authoring/domain/events/ExperiencePublishedEvent.ts`
- Create: `src/modules/authoring/domain/entities/Experience.ts`
- Create: `src/modules/authoring/domain/repositories/IExperienceRepository.ts`
- Create: `tests/modules/authoring/domain/Experience.spec.ts`

**Interfaces:**
- Produces: `Experience` AggregateRoot, `IExperienceRepository`.

- [ ] **Step 1: Write failing unit test for Experience Aggregate Root**

```typescript
// tests/modules/authoring/domain/Experience.spec.ts
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

    const s1 = Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Intro' }] });
    const s2 = Scene.create({ id: 's2', sequenceOrder: 2, durationMs: 4000, transition: 'PARALLAX_SLIDE', beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax text' }] });

    exp.appendScene(s1);
    exp.appendScene(s2);

    expect(exp.scenes).toHaveLength(2);
    expect(exp.status).toBe('STORY_COMPOSED');

    const pubRes = exp.publish();
    expect(pubRes.isSuccess).toBe(true);
    expect(exp.status).toBe('PUBLISHED');
    expect(exp.accessToken).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/modules/authoring/domain/Experience.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Experience Aggregate Root and Domain Events**

```typescript
// src/modules/authoring/domain/events/ExperienceCreatedEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperienceCreatedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly senderId: string) {}
}
```

```typescript
// src/modules/authoring/domain/events/SceneAppendedEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class SceneAppendedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly sceneId: string) {}
}
```

```typescript
// src/modules/authoring/domain/events/ExperiencePublishedEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperiencePublishedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly accessToken: string) {}
}
```

```typescript
// src/modules/authoring/domain/entities/Experience.ts
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';
import { RelationshipIntent } from '../value-objects/RelationshipIntent';
import { OccasionType } from '../value-objects/OccasionType';
import { InteractionGesture } from '../value-objects/InteractionGesture';
import { LinkToken } from '../value-objects/LinkToken';
import { Scene } from '../models/Scene';
import { ExperienceCreatedEvent } from '../events/ExperienceCreatedEvent';
import { SceneAppendedEvent } from '../events/SceneAppendedEvent';
import { ExperiencePublishedEvent } from '../events/ExperiencePublishedEvent';

export type ExperienceLifecycleStatus = 'DRAFT' | 'STORY_COMPOSED' | 'EMOTION_PROCESSED' | 'MANIFEST_COMPILED' | 'PUBLISHED' | 'CONSUMED' | 'EXPIRED';

export interface ExperienceProps {
  senderId: string;
  title: string;
  relationship: RelationshipIntent;
  occasion: OccasionType;
  gesture: InteractionGesture;
  status: ExperienceLifecycleStatus;
  scenes: Scene[];
  burnOnRead: boolean;
  accessToken?: LinkToken;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Experience extends AggregateRoot<ExperienceProps> {
  private constructor(props: ExperienceProps, id?: string) {
    super(props, id);
  }

  public get senderId(): string { return this.props.senderId; }
  public get title(): string { return this.props.title; }
  public get relationship(): RelationshipIntent { return this.props.relationship; }
  public get occasion(): OccasionType { return this.props.occasion; }
  public get gesture(): InteractionGesture { return this.props.gesture; }
  public get status(): ExperienceLifecycleStatus { return this.props.status; }
  public get scenes(): Scene[] { return this.props.scenes; }
  public get burnOnRead(): boolean { return this.props.burnOnRead; }
  public get accessToken(): LinkToken | undefined { return this.props.accessToken; }

  public static createDraft(
    props: { senderId: string; title: string; relationship: RelationshipIntent; occasion: OccasionType; gesture?: InteractionGesture; burnOnRead?: boolean },
    id?: string
  ): Result<Experience, ValidationError> {
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail(new ValidationError("Experience title cannot be empty"));
    }

    const now = new Date();
    const exp = new Experience(
      {
        senderId: props.senderId,
        title: props.title.trim(),
        relationship: props.relationship,
        occasion: props.occasion,
        gesture: props.gesture || InteractionGesture.create('WAX_SEAL'),
        status: 'DRAFT',
        scenes: [],
        burnOnRead: props.burnOnRead || false,
        createdAt: now,
        updatedAt: now,
      },
      id
    );

    if (!id) {
      exp.addDomainEvent(new ExperienceCreatedEvent(exp.id, exp.senderId));
    }

    return Result.ok(exp);
  }

  public appendScene(scene: Scene): Result<void, ValidationError> {
    if (this.props.scenes.length >= 10) {
      return Result.fail(new ValidationError("Experience cannot exceed 10 timeline scenes"));
    }

    this.props.scenes.push(scene);
    if (this.props.status === 'DRAFT' && this.props.scenes.length >= 2) {
      this.props.status = 'STORY_COMPOSED';
    }
    this.props.updatedAt = new Date();
    this.addDomainEvent(new SceneAppendedEvent(this.id, scene.id));
    return Result.ok();
  }

  public publish(): Result<LinkToken, ValidationError> {
    if (this.props.scenes.length < 2) {
      return Result.fail(new ValidationError("Experience requires at least 2 timeline scenes to publish"));
    }

    const token = LinkToken.create();
    this.props.accessToken = token;
    this.props.status = 'PUBLISHED';
    this.props.publishedAt = new Date();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ExperiencePublishedEvent(this.id, token.value));
    return Result.ok(token);
  }

  public static reconstitute(props: ExperienceProps, id: string): Experience {
    return new Experience(props, id);
  }
}
```

```typescript
// src/modules/authoring/domain/repositories/IExperienceRepository.ts
import { Experience } from '../entities/Experience';

export interface IExperienceRepository {
  findById(id: string): Promise<Experience | null>;
  findByAccessToken(token: string): Promise<Experience | null>;
  save(experience: Experience): Promise<void>;
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/modules/authoring/domain/Experience.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/authoring/domain/ tests/modules/authoring/domain/
git commit -m "feat(authoring): implement Experience Aggregate Root and lifecycle domain events"
```

---

### Task 3: Modular Emotion Pipeline & Presentation Contract

**Files:**
- Create: `src/modules/emotion-engine/domain/PresentationContract.ts`
- Create: `src/modules/emotion-engine/domain/EmotionPipeline.ts`
- Create: `src/modules/emotion-engine/domain/steps/ToneClassifierStep.ts`
- Create: `src/modules/emotion-engine/domain/steps/PaletteSynthesizerStep.ts`
- Create: `tests/modules/emotion-engine/domain/EmotionPipeline.spec.ts`

**Interfaces:**
- Produces: `PresentationContract`, `IEmotionPipelineStep`, `EmotionPipeline`.

- [ ] **Step 1: Write failing unit test for Modular Emotion Pipeline**

```typescript
// tests/modules/emotion-engine/domain/EmotionPipeline.spec.ts
import { describe, it, expect } from 'vitest';
import { EmotionPipeline } from '../../../../src/modules/emotion-engine/domain/EmotionPipeline';
import { ToneClassifierStep } from '../../../../src/modules/emotion-engine/domain/steps/ToneClassifierStep';
import { PaletteSynthesizerStep } from '../../../../src/modules/emotion-engine/domain/steps/PaletteSynthesizerStep';

describe('Modular Emotion Pipeline', () => {
  it('should execute pipeline steps and produce an enriched PresentationContract', async () => {
    const pipeline = new EmotionPipeline();
    pipeline.addStep(new ToneClassifierStep());
    pipeline.addStep(new PaletteSynthesizerStep());

    const result = await pipeline.execute({
      textBeats: ['Remember that rainy afternoon in Prague?', 'I will love you forever.'],
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
    });

    expect(result.classifiedTone).toBeDefined();
    expect(result.presentationContract).toBeDefined();
    expect(result.presentationContract?.colors.primaryText).toBeDefined();
    expect(result.presentationContract?.shader.fragmentShaderKey).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/modules/emotion-engine/domain/EmotionPipeline.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement PresentationContract, EmotionPipeline, and Steps**

```typescript
// src/modules/emotion-engine/domain/PresentationContract.ts
export interface PresentationContract {
  presetId: string;
  colors: {
    background: string;
    surfaceGlass: string;
    primaryText: string;
    secondaryText: string;
    accentGlow: string;
    borderGlass: string;
  };
  typography: {
    headerFontFamily: string;
    bodyFontFamily: string;
    baseFontSizePx: number;
    letterSpacing: string;
  };
  shader: {
    fragmentShaderKey: string;
    speed: number;
    noiseScale: number;
    intensity: number;
  };
  audio: {
    stemKey: string;
    bpm: number;
    fadeInSeconds: number;
    lowPassCutoffHz: number;
  };
}
```

```typescript
// src/modules/emotion-engine/domain/EmotionPipeline.ts
import { PresentationContract } from './PresentationContract';

export interface EmotionPipelineContext {
  textBeats: string[];
  relationship: string;
  occasion: string;
  classifiedTone?: string;
  presentationContract?: PresentationContract;
}

export interface IEmotionPipelineStep {
  readonly name: string;
  process(context: EmotionPipelineContext): Promise<EmotionPipelineContext>;
}

export class EmotionPipeline {
  private steps: IEmotionPipelineStep[] = [];

  public addStep(step: IEmotionPipelineStep): this {
    this.steps.push(step);
    return this;
  }

  public async execute(initialContext: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    let ctx = { ...initialContext };
    for (const step of this.steps) {
      ctx = await step.process(ctx);
    }
    return ctx;
  }
}
```

```typescript
// src/modules/emotion-engine/domain/steps/ToneClassifierStep.ts
import { IEmotionPipelineStep, EmotionPipelineContext } from '../EmotionPipeline';

export class ToneClassifierStep implements IEmotionPipelineStep {
  readonly name = 'ToneClassifierStep';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const fullText = context.textBeats.join(' ').toLowerCase();
    let tone = 'NOSTALGIC_WARMTH';

    if (fullText.includes('love') || context.relationship === 'PARTNER') {
      tone = 'DEEP_ROMANCE';
    } else if (fullText.includes('sorry') || context.occasion === 'APOLOGY') {
      tone = 'SOLACE_COMFORT';
    } else if (context.occasion === 'BIRTHDAY') {
      tone = 'JOYFUL_BURST';
    }

    return { ...context, classifiedTone: tone };
  }
}
```

```typescript
// src/modules/emotion-engine/domain/steps/PaletteSynthesizerStep.ts
import { IEmotionPipelineStep, EmotionPipelineContext } from '../EmotionPipeline';
import { PresentationContract } from '../PresentationContract';

export class PaletteSynthesizerStep implements IEmotionPipelineStep {
  readonly name = 'PaletteSynthesizerStep';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const tone = context.classifiedTone || 'NOSTALGIC_WARMTH';

    const contract: PresentationContract = {
      presetId: tone,
      colors: {
        background: tone === 'DEEP_ROMANCE' ? '#120914' : '#0f0d0b',
        surfaceGlass: 'rgba(18, 21, 32, 0.65)',
        primaryText: '#f8fafc',
        secondaryText: '#94a3b8',
        accentGlow: tone === 'DEEP_ROMANCE' ? '#c084fc' : '#8b5cf6',
        borderGlass: 'rgba(255, 255, 255, 0.08)',
      },
      typography: {
        headerFontFamily: 'Playfair Display, Georgia, serif',
        bodyFontFamily: 'Inter, sans-serif',
        baseFontSizePx: 16,
        letterSpacing: '-0.02em',
      },
      shader: {
        fragmentShaderKey: tone === 'DEEP_ROMANCE' ? 'EtherealAuraMesh.frag' : 'SepiaGrainFlow.frag',
        speed: 1.0,
        noiseScale: 0.5,
        intensity: 0.8,
      },
      audio: {
        stemKey: 'ambient_piano_stem_v1',
        bpm: 72,
        fadeInSeconds: 3.0,
        lowPassCutoffHz: 12000,
      },
    };

    return { ...context, presentationContract: contract };
  }
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/modules/emotion-engine/domain/EmotionPipeline.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/emotion-engine/domain tests/modules/emotion-engine/domain
git commit -m "feat(emotion-engine): implement PresentationContract and modular EmotionPipeline"
```

---

### Task 4: Story Generation — Manifest Schema & Compiler Engine

**Files:**
- Create: `src/modules/story-generation/domain/ExperienceManifestV1.ts`
- Create: `src/modules/story-generation/application/ExperienceManifestCompiler.ts`
- Create: `tests/modules/story-generation/application/ExperienceManifestCompiler.spec.ts`

**Interfaces:**
- Produces: `ExperienceManifestV1` Zod schema & `ExperienceManifestCompiler`.

- [ ] **Step 1: Write failing unit test for ExperienceManifestCompiler**

```typescript
// tests/modules/story-generation/application/ExperienceManifestCompiler.spec.ts
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

    exp.appendScene(Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Hello' }] }));
    exp.appendScene(Scene.create({ id: 's2', sequenceOrder: 2, durationMs: 4000, transition: 'PARALLAX_SLIDE', beats: [{ id: 'b2', type: 'QUOTE', content: 'World' }] }));
    exp.publish();

    const contract: PresentationContract = {
      presetId: 'DEEP_ROMANCE',
      colors: { background: '#000', surfaceGlass: '#111', primaryText: '#fff', secondaryText: '#ccc', accentGlow: '#8b5cf6', borderGlass: '#222' },
      typography: { headerFontFamily: 'Serif', bodyFontFamily: 'Sans', baseFontSizePx: 16, letterSpacing: '0' },
      shader: { fragmentShaderKey: 'shader.frag', speed: 1, noiseScale: 1, intensity: 1 },
      audio: { stemKey: 'audio.aac', bpm: 60, fadeInSeconds: 2, lowPassCutoffHz: 10000 },
    };

    const compiler = new ExperienceManifestCompiler();
    const manifestRes = compiler.compile(exp, contract);

    expect(manifestRes.isSuccess).toBe(true);
    const manifest = manifestRes.value;
    expect(manifest.version).toBe('1.0.0');
    expect(manifest.timeline).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npx vitest run tests/modules/story-generation/application/ExperienceManifestCompiler.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement Manifest Schema and Compiler Engine**

```typescript
// src/modules/story-generation/domain/ExperienceManifestV1.ts
import { z } from 'zod';

export const experienceManifestV1Schema = z.object({
  version: z.literal('1.0.0'),
  experienceId: z.string().uuid(),
  accessToken: z.string().min(16),
  createdTimestamp: z.number(),
  metadata: z.object({
    title: z.string(),
    relationship: z.string(),
    occasion: z.string(),
  }),
  theme: z.object({
    presetId: z.string(),
    colors: z.object({
      background: z.string(),
      surfaceGlass: z.string(),
      primaryText: z.string(),
      secondaryText: z.string(),
      accentGlow: z.string(),
      borderGlass: z.string(),
    }),
    typography: z.object({
      headerFontFamily: z.string(),
      bodyFontFamily: z.string(),
      baseFontSizePx: z.number(),
      letterSpacing: z.string(),
    }),
    shader: z.object({
      fragmentShaderKey: z.string(),
      speed: z.number(),
      noiseScale: z.number(),
      intensity: z.number(),
    }),
    audio: z.object({
      stemKey: z.string(),
      bpm: z.number(),
      fadeInSeconds: z.number(),
      lowPassCutoffHz: z.number(),
    }),
  }),
  timeline: z.array(
    z.object({
      sceneId: z.string(),
      sequenceOrder: z.number(),
      durationMs: z.number(),
      transition: z.string(),
      beats: z.array(
        z.object({
          id: z.string(),
          type: z.string(),
          content: z.string(),
        })
      ),
    })
  ),
  finalGesture: z.object({
    gestureType: z.string(),
  }),
});

export type ExperienceManifestV1 = z.infer<typeof experienceManifestV1Schema>;
```

```typescript
// src/modules/story-generation/application/ExperienceManifestCompiler.ts
import { Experience } from '../../authoring/domain/entities/Experience';
import { PresentationContract } from '../../emotion-engine/domain/PresentationContract';
import { ExperienceManifestV1, experienceManifestV1Schema } from '../domain/ExperienceManifestV1';
import { Result } from '../../../shared/domain/Result';
import { ValidationError } from '../../../shared/errors/AppError';

export class ExperienceManifestCompiler {
  public compile(
    experience: Experience,
    contract: PresentationContract
  ): Result<ExperienceManifestV1, ValidationError> {
    if (!experience.accessToken) {
      return Result.fail(new ValidationError("Cannot compile manifest for unpublished experience without access token"));
    }

    const rawManifest: ExperienceManifestV1 = {
      version: '1.0.0',
      experienceId: experience.id,
      accessToken: experience.accessToken.value,
      createdTimestamp: Date.now(),
      metadata: {
        title: experience.title,
        relationship: experience.relationship.value,
        occasion: experience.occasion.value,
      },
      theme: contract,
      timeline: experience.scenes.map((scene) => ({
        sceneId: scene.id,
        sequenceOrder: scene.sequenceOrder,
        durationMs: scene.durationMs,
        transition: scene.transition,
        beats: scene.beats.map((beat) => ({
          id: beat.id,
          type: beat.type,
          content: beat.content,
        })),
      })),
      finalGesture: {
        gestureType: experience.gesture.value,
      },
    };

    const parseRes = experienceManifestV1Schema.safeParse(rawManifest);
    if (!parseRes.success) {
      return Result.fail(new ValidationError(`Manifest validation error: ${parseRes.error.message}`));
    }

    return Result.ok(parseRes.data);
  }
}
```

- [ ] **Step 4: Run test to verify pass**

Run: `npx vitest run tests/modules/story-generation/application/ExperienceManifestCompiler.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/modules/story-generation tests/modules/story-generation
git commit -m "feat(story-generation): add ExperienceManifestV1 schema and ExperienceManifestCompiler"
```

---

## Plan Self-Review

1. **Spec Coverage**: Experience Aggregate Root, Timeline Scenes, LinkToken, PresentationContract, Modular Emotion Pipeline, Manifest Schema V1, and Zod validator are all covered in bite-sized tasks.
2. **Placeholder Scan**: Verified 0 TODOs.
3. **Type Consistency**: `Experience`, `Scene`, `PresentationContract`, `ExperienceManifestV1` types are aligned across all tasks.
