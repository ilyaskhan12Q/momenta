import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';
import { IEmotionAnalyzer } from '../interfaces/IEmotionAnalyzer';
import { RuleBasedEmotionAnalyzer } from '../analyzers/RuleBasedEmotionAnalyzer';

export class EmotionScoringStage implements IEmotionPipelineStage {
  readonly name = 'EmotionScoringStage';

  constructor(private readonly analyzer: IEmotionAnalyzer = new RuleBasedEmotionAnalyzer()) {}

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const analysisResult = await this.analyzer.analyze(
      context.textBeats,
      context.relationship,
      context.occasion
    );

    return {
      ...context,
      analysisResult,
    };
  }
}
