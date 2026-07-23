import { IEmotionPipelineStage, EmotionPipelineContext } from '../interfaces/IEmotionPipelineStage';
import { ValidationError } from '../../../../shared/errors/AppError';

export class StructuralValidationStage implements IEmotionPipelineStage {
  readonly name = 'StructuralValidationStage';

  async process(context: EmotionPipelineContext): Promise<EmotionPipelineContext> {
    const contract = context.presentationContract;
    if (!contract) {
      throw new ValidationError('StructuralValidationStage failed: presentationContract missing');
    }
    if (!contract.colors || !contract.typography || !contract.shader) {
      throw new ValidationError('StructuralValidationStage failed: required token sections missing');
    }
    return context;
  }
}
