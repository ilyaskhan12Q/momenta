import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';

export class LanguageDetectionStage implements IEmotionPipelineStage {
  readonly name = 'LanguageDetectionStage';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    // Simple pure language heuristic without external network calls
    return {
      ...context,
      detectedLanguage: context.detectedLanguage || 'en',
    };
  }
}
