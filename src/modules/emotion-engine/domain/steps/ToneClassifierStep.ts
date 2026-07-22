import { IEmotionPipelineStep, EmotionPipelineContext } from '../EmotionPipeline';

export class ToneClassifierStep implements IEmotionPipelineStep {
  readonly name = 'ToneClassifierStep';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const fullText = context.textBeats.join(' ').toLowerCase();
    let tone = 'NOSTALGIC_WARMTH';

    if (fullText.includes('love') || context.relationship === 'PARTNER') {
      tone = 'DEEP_ROMANCE';
    } else if (fullText.includes('sorry') || context.occasion === 'APOLOGY') {
      tone = 'SOLACE_COMFORT';
    } else if (context.occasion === 'BIRTHDAY') {
      tone = 'JOYFUL_BURST';
    }

    return { ...context, classifiedTone: tone };
  }
}
