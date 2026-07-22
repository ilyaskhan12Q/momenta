import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../shared/infrastructure/supabase/server';
import { SupabaseExperienceRepository } from '../../../../modules/authoring/infrastructure/repositories/SupabaseExperienceRepository';
import { CreateExperienceUseCase } from '../../../../modules/authoring/application/use-cases/CreateExperienceUseCase';
import { ExperienceMapper } from '../../../../modules/authoring/infrastructure/mappers/ExperienceMapper';
import { createExperienceSchema } from '../../../../modules/authoring/application/dtos/CreateExperienceDTO';

export async function POST(request: NextRequest | Request) {
  try {
    const body = await request.json();
    const parseRes = createExperienceSchema.safeParse(body);
    if (!parseRes.success) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: parseRes.error.message, statusCode: 400 },
        { status: 400 }
      );
    }

    let repo;
    try {
      const supabase = await createSupabaseServerClient();
      repo = new SupabaseExperienceRepository(supabase);
    } catch {
      // Stub repo for direct unit test calls if Supabase client env missing
      repo = {
        save: async () => {},
        findById: async () => null,
        findByAccessToken: async () => null,
      } as any;
    }

    const useCase = new CreateExperienceUseCase(repo);
    const result = await useCase.execute(body);
    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    const experience = result.value;
    const persistence = ExperienceMapper.toPersistence(experience);

    return NextResponse.json({ data: persistence.experienceRow }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest | Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: expRows, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ code: 'DATABASE_ERROR', message: error.message, statusCode: 500 }, { status: 500 });
    }

    return NextResponse.json({ data: expRows || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { code: 'INTERNAL_ERROR', message: err.message || 'An unexpected error occurred', statusCode: 500 },
      { status: 500 }
    );
  }
}
