import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError } from '../../../../shared/errors/AppError';

export interface GetExperienceDTO {
  experienceId?: string;
  accessToken?: string;
}

export class GetExperienceUseCase {
  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: GetExperienceDTO): Promise<Result<Experience, AppError>> {
    let experience: Experience | null = null;

    if (dto.experienceId) {
      experience = await this.expRepo.findById(dto.experienceId);
    } else if (dto.accessToken) {
      experience = await this.expRepo.findByAccessToken(dto.accessToken);
    }

    if (!experience || experience.status === 'DELETED') {
      return Result.fail(new NotFoundError('Experience not found'));
    }

    return Result.ok(experience);
  }
}
