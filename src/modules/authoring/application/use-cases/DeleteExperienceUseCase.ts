import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { ExperienceDeletedEvent } from '../../domain/events/ExperienceDeletedEvent';
import { DomainEventBus } from '../../../../shared/domain/DomainEventBus';
import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ForbiddenError } from '../../../../shared/errors/AppError';

export interface DeleteExperienceDTO {
  experienceId: string;
  senderId: string;
}

export class DeleteExperienceUseCase {
  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: DeleteExperienceDTO): Promise<Result<void, AppError>> {
    const experience = await this.expRepo.findById(dto.experienceId);
    if (!experience) {
      return Result.fail(new NotFoundError(`Experience ${dto.experienceId} not found`));
    }

    if (experience.senderId !== dto.senderId) {
      return Result.fail(new ForbiddenError('You are not authorized to delete this experience'));
    }

    (experience as any).props.status = 'DELETED';
    (experience as any).props.updatedAt = new Date();

    await this.expRepo.save(experience);
    await DomainEventBus.dispatch(new ExperienceDeletedEvent(experience.id, experience.senderId));

    return Result.ok();
  }
}
