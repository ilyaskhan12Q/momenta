import { Result } from '../../../../shared/domain/Result';
import { AppError, ValidationError } from '../../../../shared/errors/AppError';
import { ExperiencePresentationContract } from '../../domain/contracts/ExperiencePresentationContract';
import { EmotionPipelineOrchestrator } from '../../domain/EmotionPipelineOrchestrator';

export interface ProcessEmotionPipelineDTO {
  experienceId: string;
  senderId: string;
  relationship: string;
  occasion: string;
  textBeats: string[];
  gestureType?: string;
}

export class ProcessEmotionPipelineUseCase {
  constructor(private readonly orchestrator = new EmotionPipelineOrchestrator()) {}

  async execute(dto: ProcessEmotionPipelineDTO): Promise<Result<ExperiencePresentationContract, AppError>> {
    if (!dto.textBeats || dto.textBeats.length === 0) {
      return Result.fail(new ValidationError('textBeats cannot be empty'));
    }

    try {
      const contract = await this.orchestrator.execute({
        experienceId: dto.experienceId,
        senderId: dto.senderId,
        relationship: dto.relationship || 'PARTNER',
        occasion: dto.occasion || 'ANNIVERSARY',
        textBeats: dto.textBeats,
        gestureType: dto.gestureType,
      });

      return Result.ok(contract);
    } catch (err) {
      if (err instanceof AppError) {
        return Result.fail(err);
      }
      return Result.fail(new ValidationError((err as Error).message));
    }
  }
}
