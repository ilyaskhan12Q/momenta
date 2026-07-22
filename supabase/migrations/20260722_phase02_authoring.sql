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
