import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../../../../shared/infrastructure/supabase/server';
import { SupabaseExperienceRepository } from '../../../../../../modules/authoring/infrastructure/repositories/SupabaseExperienceRepository';
import { SupabaseManifestRepository } from '../../../../../../modules/story-manifest/infrastructure/repositories/SupabaseManifestRepository';
import { InMemoryExperienceStore } from '../../../../../../shared/infrastructure/repositories/InMemoryExperienceStore';
import { CompileAndPublishManifestUseCase } from '../../../../../../modules/story-manifest/application/use-cases/CompileAndPublishManifestUseCase';

export async function POST(request: NextRequest | Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    let expRepo;
    let manifestRepo;

    try {
      const supabase = await createSupabaseServerClient();
      expRepo = new SupabaseExperienceRepository(supabase);
      manifestRepo = new SupabaseManifestRepository(supabase);
    } catch {
      const memoryStore = InMemoryExperienceStore.getInstance();
      expRepo = memoryStore;
      manifestRepo = memoryStore;
    }

    const useCase = new CompileAndPublishManifestUseCase(expRepo, manifestRepo);

    const result = await useCase.execute({
      experienceId: id,
      senderId: body.senderId || 'user-demo',
      senderDisplayName: body.senderDisplayName,
    });

    if (result.isFailure) {
      const err = result.error;
      return NextResponse.json(err.toJSON(), { status: err.statusCode || 400 });
    }

    const manifest = result.value;

    return NextResponse.json(
      {
        data: manifest,
        accessToken: manifest.linkToken,
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
