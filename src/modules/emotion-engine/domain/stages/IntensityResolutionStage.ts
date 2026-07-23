import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';

export class IntensityResolutionStage implements IEmotionPipelineStage {
  readonly name = 'IntensityResolutionStage';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const textLength = context.textBeats.join(' ').length;
    const confidence = context.analysisResult?.confidence ?? 0.8;
    const intensity = Math.min(1.0, Math.max(0.2, (textLength / 500) * 0.5 + confidence * 0.5));

    return {
      ...context,
      intensityScore: Number(intensity.toFixed(2)),
    };
  }
}
