import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ForbiddenError, ValidationError } from '../../../../shared/errors/AppError';
import { IExperienceRepository } from '../../../authoring/domain/repositories/IExperienceRepository';
import { EmotionPipelineOrchestrator } from '../../../emotion-engine/domain/EmotionPipelineOrchestrator';
import { StoryManifestV1 } from '../../domain/contracts/StoryManifestV1';
import { StoryManifestCompiler } from '../../domain/compiler/StoryManifestCompiler';
import { ManifestValidationSpec } from '../../domain/specifications/ManifestValidationSpec';
import { IManifestRepository } from '../../domain/repositories/IManifestRepository';

export interface CompileAndPublishManifestDTO {
  experienceId: string;
  senderId: string;
  senderDisplayName?: string;
}

export class CompileAndPublishManifestUseCase {
  private orchestrator = new EmotionPipelineOrchestrator();
  private compiler = new StoryManifestCompiler();
  private validationSpec = new ManifestValidationSpec();

  constructor(
    private readonly experienceRepo: IExperienceRepository,
    private readonly manifestRepo: IManifestRepository
  ) {}

  async execute(dto: CompileAndPublishManifestDTO): Promise<Result<StoryManifestV1, AppError>> {
    const experience = await this.experienceRepo.findById(dto.experienceId);
    if (!experience) {
      return Result.fail(new NotFoundError(`Experience ${dto.experienceId} not found`));
    }
    if (experience.senderId !== dto.senderId) {
      return Result.fail(new ForbiddenError('You are not authorized to publish this experience'));
    }

    const textBeats = experience.scenes.flatMap((s) => s.beats);
    if (textBeats.length === 0) {
      return Result.fail(new ValidationError('Cannot publish an experience without scenes or text beats'));
    }

    try {
      const presentation = await this.orchestrator.execute({
        experienceId: experience.id,
        senderId: experience.senderId,
        relationship: experience.relationship.value,
        occasion: experience.occasion.value,
        gestureType: experience.gesture.value,
        textBeats,
      });

      const publishResult = experience.publish();
      if (publishResult.isFailure) {
        return Result.fail(publishResult.error);
      }

      const manifest = this.compiler.compile(experience, presentation, dto.senderDisplayName);
      const validationResult = this.validationSpec.isSatisfiedBy(manifest);
      if (validationResult.isFailure) {
        return Result.fail(validationResult.error);
      }

      await this.manifestRepo.saveManifest(manifest);
      await this.experienceRepo.save(experience);

      return Result.ok(manifest);
    } catch (err) {
      if (err instanceof AppError) return Result.fail(err);
      return Result.fail(new ValidationError((err as Error).message));
    }
  }
}
