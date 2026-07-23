import { EmotionPipelineContext } from './IEmotionPipelineStage';
import { ExperiencePresentationContract } from '../contracts/ExperiencePresentationContract';

export interface IPipelineHook {
  beforePipeline?(context: EmotionPipelineContext): Promise<void>;
  beforeStage?(stageName: string, context: EmotionPipelineContext): Promise<void>;
  afterStage?(stageName: string, context: EmotionPipelineContext, durationMs: number): Promise<void>;
  beforeValidation?(context: EmotionPipelineContext): Promise<void>;
  afterPipeline?(context: EmotionPipelineContext, contract: ExperiencePresentationContract): Promise<void>;
}
