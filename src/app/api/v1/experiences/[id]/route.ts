import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../shared/infrastructure/supabase/server';
import { SupabaseExperienceRepository } from '../../../../../modules/authoring/infrastructure/repositories/SupabaseExperienceRepository';
import { GetExperienceUseCase } from '../../../../../modules/authoring/application/use-cases/GetExperienceUseCase';
import { UpdateExperienceUseCase } from '../../../../../modules/authoring/application/use-cases/UpdateExperienceUseCase';
import { DeleteExperienceUseCase } from '../../../../../modules/authoring/application/use-cases/DeleteExperienceUseCase';
import { ExperienceMapper } from '../../../../../modules/authoring/infrastructure/mappers/ExperienceMapper';

function getFallbackRepo() {
  return {
    findById: async () => null,
    findByAccessToken: async () => null,
    save: async () => {},
  } as any;
}

export async function GET(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    let repo;
    try {
      const supabase = await createSupabaseServerClient();
      repo = new SupabaseExperienceRepository(supabase);
    } catch {
      repo = getFallbackRepo();
    }

    const useCase = new GetExperienceUseCase(repo);
    const result = await useCase.execute({ experienceId: id });
    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 404 });
    }

    const persistence = ExperienceMapper.toPersistence(result.value);
    return NextResponse.json({ data: persistence }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    let repo;
    try {
      const supabase = await createSupabaseServerClient();
      repo = new SupabaseExperienceRepository(supabase);
    } catch {
      repo = getFallbackRepo();
    }

    const useCase = new UpdateExperienceUseCase(repo);
    const result = await useCase.execute({ ...body, experienceId: id });
    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    const persistence = ExperienceMapper.toPersistence(result.value);
    return NextResponse.json({ data: persistence }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const senderId = searchParams.get('senderId') || '';

    let repo;
    try {
      const supabase = await createSupabaseServerClient();
      repo = new SupabaseExperienceRepository(supabase);
    } catch {
      repo = getFallbackRepo();
    }

    const useCase = new DeleteExperienceUseCase(repo);
    const result = await useCase.execute({ experienceId: id, senderId });
    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    return NextResponse.json({ message: 'Experience deleted successfully' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}
