import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { Scene } from '../../domain/models/Scene';
import { UpdateExperienceDTO, updateExperienceSchema } from '../dtos/UpdateExperienceDTO';
import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ForbiddenError, ValidationError } from '../../../../shared/errors/AppError';

export class UpdateExperienceUseCase {
  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: UpdateExperienceDTO): Promise<Result<Experience, AppError>> {
    const parseRes = updateExperienceSchema.safeParse(dto);
    if (!parseRes.success) {
      return Result.fail(new ValidationError(`Validation failed: ${parseRes.error.message}`));
    }

    const experience = await this.expRepo.findById(dto.experienceId);
    if (!experience) {
      return Result.fail(new NotFoundError(`Experience ${dto.experienceId} not found`));
    }

    if (experience.senderId !== dto.senderId) {
      return Result.fail(new ForbiddenError('You are not authorized to update this experience'));
    }

    if (dto.title) {
      (experience as any).props.title = dto.title.trim();
    }

    if (dto.scenes) {
      (experience as any).props.scenes = dto.scenes.map((s) =>
        Scene.create({
          id: s.id,
          sequenceOrder: s.sequenceOrder,
          durationMs: s.durationMs,
          transition: s.transition,
          beats: s.beats,
        })
      );
    }

    (experience as any).props.updatedAt = new Date();
    await this.expRepo.save(experience);

    return Result.ok(experience);
  }
}
