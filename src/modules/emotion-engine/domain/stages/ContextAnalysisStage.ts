import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';

export class ContextAnalysisStage implements IEmotionPipelineStage {
  readonly name = 'ContextAnalysisStage';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const wordCount = context.textBeats.reduce((sum, b) => sum + String(b || '').split(/\s+/).filter(Boolean).length, 0);

    return {
      ...context,
      contextMetadata: {
        totalWordCount: wordCount,
        beatCount: context.textBeats.length,
        relationship: context.relationship,
        occasion: context.occasion,
      },
    };
  }
}
