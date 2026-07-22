import { PresentationContract } from './PresentationContract';

export interface EmotionPipelineContext {
  textBeats: string[];
  relationship: string;
  occasion: string;
  classifiedTone?: string;
  presentationContract?: PresentationContract;
}

export interface IEmotionPipelineStep {
  readonly name: string;
  process(context: EmotionPipelineContext): Promise<EmotionPipelineContext>;
}

export class EmotionPipeline {
  private steps: IEmotionPipelineStep[] = [];

  public addStep(step: IEmotionPipelineStep): this {
    this.steps.push(step);
    return this;
  }

  public async execute(initialContext: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    let ctx = { ...initialContext };
    for (const step of this.steps) {
      ctx = await step.process(ctx);
    }
    return ctx;
  }
}
