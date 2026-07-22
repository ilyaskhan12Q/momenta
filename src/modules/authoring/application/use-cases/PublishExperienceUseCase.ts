import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { PublishingPolicy } from '../../domain/policies/PublishingPolicy';
import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ForbiddenError } from '../../../../shared/errors/AppError';

export interface PublishExperienceDTO {
  experienceId: string;
  senderId: string;
}

export class PublishExperienceUseCase {
  private publishingPolicy = new PublishingPolicy();

  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: PublishExperienceDTO): Promise<Result<Experience, AppError>> {
    const experience = await this.expRepo.findById(dto.experienceId);
    if (!experience) {
      return Result.fail(new NotFoundError(`Experience ${dto.experienceId} not found`));
    }

    if (experience.senderId !== dto.senderId) {
      return Result.fail(new ForbiddenError('You are not authorized to publish this experience'));
    }

    const policyRes = this.publishingPolicy.canPublish(experience);
    if (policyRes.isFailure) {
      return Result.fail(policyRes.error);
    }

    const pubRes = experience.publish();
    if (pubRes.isFailure) {
      return Result.fail(pubRes.error);
    }

    await this.expRepo.save(experience);
    return Result.ok(experience);
  }
}
