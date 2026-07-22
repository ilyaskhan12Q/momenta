import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../../shared/infrastructure/supabase/server';
import { SupabaseExperienceRepository } from '../../../../../../modules/authoring/infrastructure/repositories/SupabaseExperienceRepository';
import { PublishExperienceUseCase } from '../../../../../../modules/authoring/application/use-cases/PublishExperienceUseCase';
import { ExperienceMapper } from '../../../../../../modules/authoring/infrastructure/mappers/ExperienceMapper';

export async function POST(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    const repo = new SupabaseExperienceRepository(supabase);
    const useCase = new PublishExperienceUseCase(repo);

    const result = await useCase.execute({ experienceId: id, senderId: body.senderId });
    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    const experience = result.value;
    const persistence = ExperienceMapper.toPersistence(experience);

    return NextResponse.json(
      {
        data: persistence.experienceRow,
        accessToken: experience.accessToken?.value,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}
