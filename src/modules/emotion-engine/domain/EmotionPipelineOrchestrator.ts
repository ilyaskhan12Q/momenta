import { ExperiencePresentationContract, PipelineMetrics } from './contracts/ExperiencePresentationContract';
import { EmotionPipelineContext, IEmotionPipelineStage } from './interfaces/IEmotionPipelineStage';
import { IPipelineHook } from './interfaces/IPipelineHook';
import { LanguageDetectionStage } from './stages/LanguageDetectionStage';
import { ContextAnalysisStage } from './stages/ContextAnalysisStage';
import { EmotionScoringStage } from './stages/EmotionScoringStage';
import { IntensityResolutionStage } from './stages/IntensityResolutionStage';
import { PresentationResolutionStage } from './stages/PresentationResolutionStage';
import { StructuralValidationStage } from './stages/StructuralValidationStage';
import { ExperienceValidationStage } from './stages/ExperienceValidationStage';
import { EmotionPipelineStartedEvent } from './events/EmotionPipelineStartedEvent';
import { EmotionPipelineCompletedEvent } from './events/EmotionPipelineCompletedEvent';
import { DomainEventBus } from '../../../shared/domain/DomainEventBus';

export class EmotionPipelineOrchestrator {
  private stages: IEmotionPipelineStage[];

  constructor(
    stages?: IEmotionPipelineStage[],
    private readonly hooks: IPipelineHook[] = []
  ) {
    this.stages = stages || [
      new LanguageDetectionStage(),
      new ContextAnalysisStage(),
      new EmotionScoringStage(),
      new IntensityResolutionStage(),
      new PresentationResolutionStage(),
      new StructuralValidationStage(),
      new ExperienceValidationStage(),
    ];
  }

  async execute(initialContext: EmotionPipelineContext): Promise<ExperiencePresentationContract> {
    const startTime = Date.now();

    await DomainEventBus.dispatch(
      new EmotionPipelineStartedEvent(initialContext.experienceId, initialContext.senderId)
    );

    for (const hook of this.hooks) {
      if (hook.beforePipeline) await hook.beforePipeline(initialContext);
    }

    let context = { ...initialContext };
    const stageTimes: Record<string, number> = {};

    for (const stage of this.stages) {
      for (const hook of this.hooks) {
        if (hook.beforeStage) await hook.beforeStage(stage.name, context);
      }

      const stageStart = Date.now();
      context = await stage.process(context);
      const stageDuration = Date.now() - stageStart;
      stageTimes[stage.name] = stageDuration;

      for (const hook of this.hooks) {
        if (hook.afterStage) await hook.afterStage(stage.name, context, stageDuration);
      }
    }

    for (const hook of this.hooks) {
      if (hook.beforeValidation) await hook.beforeValidation(context);
    }

    const totalExecutionTimeMs = Date.now() - startTime;
    const contract = context.presentationContract!;

    const metrics: PipelineMetrics = {
      languageDetectionMs: stageTimes['LanguageDetectionStage'] || 0,
      contextAnalysisMs: stageTimes['ContextAnalysisStage'] || 0,
      emotionScoringMs: stageTimes['EmotionScoringStage'] || 0,
      intensityResolutionMs: stageTimes['IntensityResolutionStage'] || 0,
      presentationResolutionMs: stageTimes['PresentationResolutionStage'] || 0,
      structuralValidationMs: stageTimes['StructuralValidationStage'] || 0,
      experienceValidationMs: stageTimes['ExperienceValidationStage'] || 0,
      totalExecutionTimeMs,
    };

    contract.pipeline.metrics = metrics;

    for (const hook of this.hooks) {
      if (hook.afterPipeline) await hook.afterPipeline(context, contract);
    }

    await DomainEventBus.dispatch(
      new EmotionPipelineCompletedEvent(
        initialContext.experienceId,
        contract.emotionProfile.primaryEmotion,
        totalExecutionTimeMs
      )
    );

    return contract;
  }
}
