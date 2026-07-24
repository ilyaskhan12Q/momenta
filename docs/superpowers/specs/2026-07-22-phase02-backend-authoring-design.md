# Momenta Phase 02 Backend Authoring Domain & API — Technical Design Specification

**Date:** 2026-07-22  
**Status:** Approved  
**Author:** Lead Backend Engineer & System Architect  

---

## 1. Executive Summary & Bounded Context Scope

Phase 02 implements the **Backend Authoring Bounded Context** (`src/modules/authoring`) for Momenta.

This specification covers:
1. **Domain Layer**: `Experience` Aggregate Root, `Story` Subdomain Entity, `Scene` Entity, Value Objects, Domain Events, `PublishingPolicy`, `StoryLengthSpecification`, and `IExperienceRepository`.
2. **Application Layer**: `CreateExperienceUseCase`, `UpdateExperienceUseCase`, `PublishExperienceUseCase`, `GetExperienceUseCase`, `DeleteExperienceUseCase`, DTOs, and Zod schemas.
3. **Infrastructure Layer**: PostgreSQL database migration (`supabase/migrations/20260722_phase02_authoring.sql`), RLS policies, indexes, foreign keys, `ExperienceMapper`, and `SupabaseExperienceRepository`.
4. **Presentation API Layer**: Production Next.js App Router API endpoints (`/api/v1/experiences`, `/api/v1/experiences/[id]`, `/api/v1/experiences/[id]/publish`) with authentication, authorization, Zod validation, and typed error responses.
5. **Testing**: Comprehensive unit, integration, and API test suites.

---

## 2. Database Schema & Migration Specification

### File: `supabase/migrations/20260722_phase02_authoring.sql`

```sql
-- Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: experiences
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Table: stories
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: scenes
CREATE TABLE IF NOT EXISTS public.scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    sequence_order INT NOT NULL,
    duration_ms INT NOT NULL DEFAULT 4000,
    transition VARCHAR(50) NOT NULL DEFAULT 'FADE_UP',
    beats JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiences_sender_id ON public.experiences(sender_id);
CREATE INDEX IF NOT EXISTS idx_experiences_access_token ON public.experiences(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_experiences_status ON public.experiences(status);
CREATE INDEX IF NOT EXISTS idx_stories_experience_id ON public.stories(experience_id);
CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON public.scenes(story_id);

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiences
CREATE POLICY "Senders can manage their own experiences"
    ON public.experiences FOR ALL
    USING (auth.uid() = sender_id)
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can view published experiences via access token"
    ON public.experiences FOR SELECT
    USING (status = 'PUBLISHED' AND access_token IS NOT NULL);

-- RLS Policies for stories & scenes
CREATE POLICY "Senders can manage their stories"
    ON public.stories FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.experiences e
        WHERE e.id = stories.experience_id AND e.sender_id = auth.uid()
    ));

CREATE POLICY "Recipients can view published stories"
    ON public.stories FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.experiences e
        WHERE e.id = stories.experience_id AND e.status = 'PUBLISHED'
    ));

CREATE POLICY "Senders can manage their scenes"
    ON public.scenes FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        JOIN public.experiences e ON e.id = s.experience_id
        WHERE s.id = scenes.story_id AND e.sender_id = auth.uid()
    ));

CREATE POLICY "Recipients can view published scenes"
    ON public.scenes FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.stories s
        JOIN public.experiences e ON e.id = s.experience_id
        WHERE s.id = scenes.story_id AND e.status = 'PUBLISHED'
    ));
```

---

## 3. Domain Model Architecture

### 3.1 Entities & Aggregate Structure

- `Experience` (Aggregate Root)
  - `id: string`
  - `senderId: string`
  - `title: string`
  - `relationship: RelationshipIntent`
  - `occasion: OccasionType`
  - `gesture: InteractionGesture`
  - `status: ExperienceLifecycleStatus` (`DRAFT`, `STORY_COMPOSED`, `PUBLISHED`, `DELETED`)
  - `story: Story` (Subdomain Entity holding `Scene` list)
  - `burnOnRead: boolean`
  - `accessToken?: LinkToken`

### 3.2 Specifications & Policies

- **`PublishingPolicy`**:
  - Requires `story.scenes.length >= 2` and `story.scenes.length <= 10`.
  - Enforces `StoryLengthSpecification`.
- **`StoryLengthSpecification`**:
  - Calculates total characters across all text beats. Total must be $\le 2500$ chars.

---

## 4. API Endpoint Contracts

| Method | Endpoint | Auth Required | Description | Response Code |
|---|---|---|---|---|
| `POST` | `/api/v1/experiences` | Yes (Bearer Session) | Create new experience draft | `201 Created` |
| `GET` | `/api/v1/experiences/[id]` | Optional (Token/Session) | Fetch experience by ID or Token | `200 OK` |
| `PUT` | `/api/v1/experiences/[id]` | Yes (Owner) | Update title, details, and scenes | `200 OK` |
| `POST` | `/api/v1/experiences/[id]/publish` | Yes (Owner) | Validate & publish experience | `200 OK` |
| `DELETE` | `/api/v1/experiences/[id]` | Yes (Owner) | Delete experience draft | `200 OK` |

---

## 5. Summary of Files to Produce in Phase 02

1. **Migrations**: `supabase/migrations/20260722_phase02_authoring.sql`
2. **Domain**:
   - `src/modules/authoring/domain/entities/Story.ts`
   - `src/modules/authoring/domain/specifications/StoryLengthSpecification.ts`
   - `src/modules/authoring/domain/policies/PublishingPolicy.ts`
   - `src/modules/authoring/domain/events/ExperienceUpdatedEvent.ts`
   - `src/modules/authoring/domain/events/ExperienceDeletedEvent.ts`
3. **Application**:
   - `src/modules/authoring/application/dtos/CreateExperienceDTO.ts`
   - `src/modules/authoring/application/dtos/UpdateExperienceDTO.ts`
   - `src/modules/authoring/application/use-cases/CreateExperienceUseCase.ts`
   - `src/modules/authoring/application/use-cases/UpdateExperienceUseCase.ts`
   - `src/modules/authoring/application/use-cases/PublishExperienceUseCase.ts`
   - `src/modules/authoring/application/use-cases/GetExperienceUseCase.ts`
   - `src/modules/authoring/application/use-cases/DeleteExperienceUseCase.ts`
4. **Infrastructure**:
   - `src/modules/authoring/infrastructure/mappers/ExperienceMapper.ts`
   - `src/modules/authoring/infrastructure/repositories/SupabaseExperienceRepository.ts`
5. **Presentation API**:
   - `src/app/api/v1/experiences/route.ts`
   - `src/app/api/v1/experiences/[id]/route.ts`
   - `src/app/api/v1/experiences/[id]/publish/route.ts`
6. **Tests**: Unit, integration, and API test suites.
