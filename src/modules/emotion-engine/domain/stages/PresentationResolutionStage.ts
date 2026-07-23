import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';
import { PresentationResolver } from '../resolvers/PresentationResolver';

export class PresentationResolutionStage implements IEmotionPipelineStage {
  readonly name = 'PresentationResolutionStage';

  constructor(private readonly presentationResolver = new PresentationResolver()) {}

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const presentationContract = this.presentationResolver.resolve(context);

    return {
      ...context,
      presentationContract,
    };
  }
}
