import { NextRequest, NextResponse } from 'next/server';
import { ProcessEmotionPipelineUseCase } from '@/modules/emotion-engine/application/use-cases/ProcessEmotionPipelineUseCase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const useCase = new ProcessEmotionPipelineUseCase();
    const result = await useCase.execute({
      experienceId: id,
      senderId: body.senderId || 'anonymous',
      relationship: body.relationship || 'PARTNER',
      occasion: body.occasion || 'ANNIVERSARY',
      textBeats: body.textBeats || [],
      gestureType: body.gestureType,
    });

    if (result.isFailure) {
      return NextResponse.json(result.error.toJSON(), { status: result.error.statusCode });
    }

    return NextResponse.json({ data: result.value }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { code: 'BAD_REQUEST', message: (error as Error).message },
      { status: 400 }
    );
  }
}
