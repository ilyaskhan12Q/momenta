import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';
import { ValidationError } from '../../../../shared/errors/AppError';

export class ExperienceValidationStage implements IEmotionPipelineStage {
  readonly name = 'ExperienceValidationStage';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const contract = context.presentationContract;
    if (!contract) {
      throw new ValidationError('ExperienceValidationStage failed: presentationContract missing');
    }
    if (contract.colors.contrastRatio < 4.5) {
      throw new ValidationError('ExperienceValidationStage failed: color contrast ratio does not meet WCAG AA standards (< 4.5)');
    }
    return context;
  }
}
