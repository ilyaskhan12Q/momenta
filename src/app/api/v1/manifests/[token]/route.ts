import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/shared/infrastructure/supabase/server';
import { SupabaseManifestRepository } from '@/modules/story-manifest/infrastructure/repositories/SupabaseManifestRepository';
import { GetPublishedManifestUseCase } from '@/modules/story-manifest/application/use-cases/GetPublishedManifestUseCase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = await createSupabaseServerClient();
    const manifestRepo = new SupabaseManifestRepository(supabase);
    const useCase = new GetPublishedManifestUseCase(manifestRepo);

    const result = await useCase.execute(token);

    if (result.isFailure) {
      return NextResponse.json(result.error.toJSON(), { status: result.error.statusCode });
    }

    return NextResponse.json(
      { data: result.value },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', message: (error as Error).message },
      { status: 400 }
    );
  }
}
