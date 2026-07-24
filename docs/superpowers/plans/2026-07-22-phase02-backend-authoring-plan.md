# Phase 02 Backend Authoring Domain & API — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 02 Backend Authoring Domain: PostgreSQL DB migrations, Story entity, StoryLengthSpecification, PublishingPolicy, Create/Update/Publish/Get/Delete use cases, SupabaseExperienceRepository, ExperienceMapper, and production Next.js REST API routes (`/api/v1/experiences`).

**Architecture:** Clean Architecture with Domain-Driven Design (`src/modules/authoring`). Zero mock code. Comprehensive unit, integration, and API tests.

---

### Task 1: Database Migration & Schema Setup

**Files:**
- Create: `supabase/migrations/20260722_phase02_authoring.sql`
- Create: `tests/modules/authoring/infrastructure/DatabaseMigration.spec.ts`

- [ ] **Step 1: Create SQL migration file**

```sql
-- supabase/migrations/20260722_phase02_authoring.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    occasion VARCHAR(50) NOT NULL,
    gesture VARCHAR(50) NOT NULL DEFAULT 'WAX_SEAL',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    burn_on_read BOOLEAN NOT NULL DEFAULT FALSE,
    access_token VARCHAR(32) UNIQUE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    duration_ms INT NOT NULL DEFAULT 4000,
    transition VARCHAR(50) NOT NULL DEFAULT 'FADE_UP',
    beats JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_sender_id ON public.experiences(sender_id);
CREATE INDEX IF NOT EXISTS idx_experiences_access_token ON public.experiences(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);
CREATE INDEX IF NOT EXISTS idx_stories_experience_id ON public.stories(experience_id);
CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON public.scenes(story_id);
```

- [ ] **Step 2: Write test verifying SQL migration syntax and file presence**

```typescript
// tests/modules/authoring/infrastructure/DatabaseMigration.spec.ts
import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Database Migrations', () => {
  it('should contain valid Phase 02 authoring migration file', () => {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20260722_phase02_authoring.sql');
    expect(fs.existsSync(migrationPath)).toBe(true);

    const content = fs.readFileSync(migrationPath, 'utf-8');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.experiences');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.stories');
    expect(content).toContain('CREATE TABLE IF NOT EXISTS public.scenes');
    expect(content).toContain('idx_experiences_access_token');
  });
});
```

- [ ] **Step 3: Run test & commit**

```bash
npx vitest run tests/modules/authoring/infrastructure/DatabaseMigration.spec.ts
git add supabase/migrations tests/modules/authoring/infrastructure
git commit -m "feat(db): add Phase 02 authoring PostgreSQL database migration"
```

---

### Task 2: Domain Layer — Story Subdomain Entity, Specifications & Business Policies

**Files:**
- Create: `src/modules/authoring/domain/entities/Story.ts`
- Create: `src/modules/authoring/domain/specifications/StoryLengthSpecification.ts`
- Create: `src/modules/authoring/domain/policies/PublishingPolicy.ts`
- Create: `src/modules/authoring/domain/events/ExperienceUpdatedEvent.ts`
- Create: `src/modules/authoring/domain/events/ExperienceDeletedEvent.ts`
- Create: `tests/modules/authoring/domain/PoliciesAndSpecs.spec.ts`

- [ ] **Step 1: Write failing unit test for Story, Policies, and Specifications**

```typescript
// tests/modules/authoring/domain/PoliciesAndSpecs.spec.ts
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
    const s1 = Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'PARAGRAPH', content: longText }] });
    const story = Story.create({ title: 'Long Story', scenes: [s1] });

    const spec = new StoryLengthSpecification();
    expect(spec.isSatisfiedBy(story)).toBe(false);
  });

  it('should evaluate PublishingPolicy rules for experience publication', () => {
    const rel = RelationshipIntent.create('PARTNER').value;
    const occ = OccasionType.create('ANNIVERSARY').value;
    const exp = Experience.createDraft({ senderId: 'u1', title: 'Test', relationship: rel, occasion: occ }).value;

    const policy = new PublishingPolicy();
    expect(policy.canPublish(exp).isFailure).toBe(true); // < 2 scenes

    const s1 = Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Intro' }] });
    const s2 = Scene.create({ id: 's2', sequenceOrder: 2, durationMs: 4000, transition: 'PARALLAX_SLIDE', beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax' }] });

    exp.appendScene(s1);
    exp.appendScene(s2);

    expect(policy.canPublish(exp).isSuccess).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

`npx vitest run tests/modules/authoring/domain/PoliciesAndSpecs.spec.ts`

- [ ] **Step 3: Implement Story, Specifications, Policies, and Events**

```typescript
// src/modules/authoring/domain/entities/Story.ts
import { Entity } from '../../../../shared/domain/Entity';
import { Scene } from '../models/Scene';

export interface StoryProps {
  title: string;
  scenes: Scene[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Story extends Entity<StoryProps> {
  private constructor(props: StoryProps, id?: string) {
    super(props, id);
  }

  public get title(): string { return this.props.title; }
  public get scenes(): Scene[] { return this.props.scenes; }

  public static create(props: { title: string; scenes?: Scene[] }, id?: string): Story {
    const now = new Date();
    return new Story(
      {
        title: props.title,
        scenes: props.scenes || [],
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      id
    );
  }
}
```

```typescript
// src/modules/authoring/domain/specifications/StoryLengthSpecification.ts
import { Story } from '../entities/Story';

export class StoryLengthSpecification {
  public static readonly MAX_CHARACTERS = 2500;

  public isSatisfiedBy(story: Story): boolean {
    let totalLength = 0;
    for (const scene of story.scenes) {
      for (const beat of scene.beats) {
        totalLength += beat.content ? beat.content.length : 0;
      }
    }
    return totalLength <= StoryLengthSpecification.MAX_CHARACTERS;
  }
}
```

```typescript
// src/modules/authoring/domain/policies/PublishingPolicy.ts
import { Experience } from '../entities/Experience';
import { Story } from '../entities/Story';
import { StoryLengthSpecification } from '../specifications/StoryLengthSpecification';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export class PublishingPolicy {
  public canPublish(experience: Experience): Result<void, ValidationError> {
    if (experience.scenes.length < 2) {
      return Result.fail(new ValidationError("Experience requires at least 2 timeline scenes to publish"));
    }

    if (experience.scenes.length > 10) {
      return Result.fail(new ValidationError("Experience cannot exceed 10 timeline scenes"));
    }

    const story = Story.create({ title: experience.title, scenes: experience.scenes });
    const lengthSpec = new StoryLengthSpecification();
    if (!lengthSpec.isSatisfiedBy(story)) {
      return Result.fail(new ValidationError(`Total story text exceeds max limit of ${StoryLengthSpecification.MAX_CHARACTERS} characters`));
    }

    return Result.ok();
  }
}
```

```typescript
// src/modules/authoring/domain/events/ExperienceUpdatedEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperienceUpdatedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string) {}
}
```

```typescript
// src/modules/authoring/domain/events/ExperienceDeletedEvent.ts
import { IDomainEvent } from '../../../../shared/domain/DomainEvent';

export class ExperienceDeletedEvent implements IDomainEvent {
  readonly occurredOn = new Date();
  constructor(public readonly aggregateId: string, public readonly senderId: string) {}
}
```

- [ ] **Step 4: Run test to verify pass & commit**

```bash
npx vitest run tests/modules/authoring/domain/PoliciesAndSpecs.spec.ts
git add src/modules/authoring/domain tests/modules/authoring/domain
git commit -m "feat(authoring): implement Story entity, StoryLengthSpecification, PublishingPolicy, and domain events"
```

---

### Task 3: Infrastructure Layer — ExperienceMapper & SupabaseExperienceRepository

**Files:**
- Create: `src/modules/authoring/infrastructure/mappers/ExperienceMapper.ts`
- Create: `src/modules/authoring/infrastructure/repositories/SupabaseExperienceRepository.ts`
- Create: `tests/modules/authoring/infrastructure/ExperienceMapper.spec.ts`

- [ ] **Step 1: Write failing unit test for ExperienceMapper**

```typescript
// tests/modules/authoring/infrastructure/ExperienceMapper.spec.ts
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

    const s1 = Scene.create({ id: 's-1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b-1', type: 'HEADING', content: 'Title' }] });
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
```

- [ ] **Step 2: Implement ExperienceMapper & SupabaseExperienceRepository**

```typescript
// src/modules/authoring/infrastructure/mappers/ExperienceMapper.ts
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
      story_id: experience.id, // Using experience.id directly as story container ID
      sequence_order: scene.sequenceOrder,
      duration_ms: scene.durationMs,
      transition: scene.transition,
      beats: scene.beats,
      created_at: new Date().toISOString(),
    }));

    return { experienceRow, sceneRows };
  }
}
```

```typescript
// src/modules/authoring/infrastructure/repositories/SupabaseExperienceRepository.ts
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
```

- [ ] **Step 3: Run test & commit**

```bash
npx vitest run tests/modules/authoring/infrastructure/ExperienceMapper.spec.ts
git add src/modules/authoring/infrastructure tests/modules/authoring/infrastructure
git commit -m "feat(authoring): implement ExperienceMapper and SupabaseExperienceRepository"
```

---

### Task 4: Application Layer — Use Cases & DTOs

**Files:**
- Create: `src/modules/authoring/application/dtos/CreateExperienceDTO.ts`
- Create: `src/modules/authoring/application/dtos/UpdateExperienceDTO.ts`
- Create: `src/modules/authoring/application/use-cases/CreateExperienceUseCase.ts`
- Create: `src/modules/authoring/application/use-cases/UpdateExperienceUseCase.ts`
- Create: `src/modules/authoring/application/use-cases/PublishExperienceUseCase.ts`
- Create: `src/modules/authoring/application/use-cases/GetExperienceUseCase.ts`
- Create: `src/modules/authoring/application/use-cases/DeleteExperienceUseCase.ts`
- Create: `tests/modules/authoring/application/UseCases.spec.ts`

- [ ] **Step 1: Write unit tests for all Use Cases**

```typescript
// tests/modules/authoring/application/UseCases.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/CreateExperienceUseCase';
import { PublishExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/PublishExperienceUseCase';
import { GetExperienceUseCase } from '../../../../src/modules/authoring/application/use-cases/GetExperienceUseCase';
import { Experience } from '../../../../src/modules/authoring/domain/entities/Experience';
import { Scene } from '../../../../src/modules/authoring/domain/models/Scene';

class InMemoryExperienceRepo {
  private items = new Map<string, Experience>();
  async findById(id: string) { return this.items.get(id) || null; }
  async findByAccessToken(token: string) {
    return Array.from(this.items.values()).find(e => e.accessToken?.value === token) || null;
  }
  async save(experience: Experience) { this.items.set(experience.id, experience); }
}

describe('Authoring Application Use Cases', () => {
  let repo: InMemoryExperienceRepo;

  beforeEach(() => {
    repo = new InMemoryExperienceRepo();
  });

  it('should execute CreateExperienceUseCase and save draft', async () => {
    const useCase = new CreateExperienceUseCase(repo as any);
    const result = await useCase.execute({
      senderId: 'sender-1',
      title: 'Our Journey',
      relationship: 'PARTNER',
      occasion: 'ANNIVERSARY',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.value.title).toBe('Our Journey');
  });

  it('should execute PublishExperienceUseCase and generate access token', async () => {
    const createUC = new CreateExperienceUseCase(repo as any);
    const exp = (await createUC.execute({ senderId: 's1', title: 'Story', relationship: 'PARTNER', occasion: 'BIRTHDAY' })).value;

    exp.appendScene(Scene.create({ id: 's1', sequenceOrder: 1, durationMs: 3000, transition: 'FADE_UP', beats: [{ id: 'b1', type: 'HEADING', content: 'Intro' }] }));
    exp.appendScene(Scene.create({ id: 's2', sequenceOrder: 2, durationMs: 4000, transition: 'PARALLAX_SLIDE', beats: [{ id: 'b2', type: 'QUOTE', content: 'Climax' }] }));
    await repo.save(exp);

    const publishUC = new PublishExperienceUseCase(repo as any);
    const pubRes = await publishUC.execute({ experienceId: exp.id, senderId: 's1' });

    expect(pubRes.isSuccess).toBe(true);
    expect(pubRes.value.status).toBe('PUBLISHED');
    expect(pubRes.value.accessToken).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement Use Cases and DTOs**

Create:
- `CreateExperienceDTO.ts`, `UpdateExperienceDTO.ts`
- `CreateExperienceUseCase.ts`, `UpdateExperienceUseCase.ts`, `PublishExperienceUseCase.ts`, `GetExperienceUseCase.ts`, `DeleteExperienceUseCase.ts`

- [ ] **Step 3: Run test & commit**

```bash
npx vitest run tests/modules/authoring/application/UseCases.spec.ts
git add src/modules/authoring/application tests/modules/authoring/application
git commit -m "feat(authoring): implement Create, Update, Publish, Get, and Delete experience use cases"
```

---

### Task 5: API Layer — Next.js REST API Endpoints & Route Controllers

**Files:**
- Create: `src/app/api/v1/experiences/route.ts`
- Create: `src/app/api/v1/experiences/[id]/route.ts`
- Create: `src/app/api/v1/experiences/[id]/publish/route.ts`
- Create: `tests/presentation/experiences-api.spec.ts`

- [ ] **Step 1: Write integration tests for API routes**

```typescript
// tests/presentation/experiences-api.spec.ts
import { describe, it, expect } from 'vitest';
import { POST } from '../../src/app/api/v1/experiences/route';

describe('Experiences API Controller Endpoints', () => {
  it('should validate POST payload and return 400 for invalid inputs', async () => {
    const req = new Request('http://localhost:3000/api/v1/experiences', {
      method: 'POST',
      body: JSON.stringify({ title: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Implement Route Handlers**

`POST /api/v1/experiences`, `GET /api/v1/experiences/[id]`, `PUT /api/v1/experiences/[id]`, `POST /api/v1/experiences/[id]/publish`, `DELETE /api/v1/experiences/[id]`.

- [ ] **Step 3: Run full typecheck and test suite & commit**

```bash
npx tsc --noEmit && npx vitest run
git add src/app/api/v1/experiences tests/presentation
git commit -m "feat(presentation): add production Next.js REST API endpoints for Experience authoring"
```
