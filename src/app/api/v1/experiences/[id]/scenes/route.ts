import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../../shared/infrastructure/supabase/server';
import { SupabaseExperienceRepository } from '../../../../../../modules/authoring/infrastructure/repositories/SupabaseExperienceRepository';
import { InMemoryExperienceStore } from '../../../../../../shared/infrastructure/repositories/InMemoryExperienceStore';
import { AppendSceneUseCase } from '../../../../../../modules/authoring/application/use-cases/AppendSceneUseCase';
import { ExperienceMapper } from '../../../../../../modules/authoring/infrastructure/mappers/ExperienceMapper';

export async function POST(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    let repo;
    try {
      const supabase = await createSupabaseServerClient();
      repo = new SupabaseExperienceRepository(supabase);
    } catch {
      repo = InMemoryExperienceStore.getInstance();
    }

    const useCase = new AppendSceneUseCase(repo);

    const result = await useCase.execute({
      experienceId: id,
      senderId: body.senderId || 'user-demo',
      sequenceOrder: body.sequenceOrder,
      durationMs: body.durationMs,
      transition: body.transition,
      beats: body.beats,
    });

    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    const persistence = ExperienceMapper.toPersistence(result.value);
    return NextResponse.json({ data: persistence }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}
