import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { RelationshipIntent } from '../../domain/value-objects/RelationshipIntent';
import { OccasionType } from '../../domain/value-objects/OccasionType';
import { InteractionGesture } from '../../domain/value-objects/InteractionGesture';
import { CreateExperienceDTO, createExperienceSchema } from '../dtos/CreateExperienceDTO';
import { Result } from '../../../../shared/domain/Result';
import { AppError, ValidationError } from '../../../../shared/errors/AppError';

export class CreateExperienceUseCase {
  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: CreateExperienceDTO): Promise<Result<Experience, AppError>> {
    const parseRes = createExperienceSchema.safeParse(dto);
    if (!parseRes.success) {
      return Result.fail(new ValidationError(`Validation failed: ${parseRes.error.message}`));
    }

    const relRes = RelationshipIntent.create(dto.relationship);
    if (relRes.isFailure) return Result.fail(relRes.error);

    const occRes = OccasionType.create(dto.occasion);
    if (occRes.isFailure) return Result.fail(occRes.error);

    const gesture = dto.gesture ? InteractionGesture.create(dto.gesture) : InteractionGesture.create('WAX_SEAL');

    const expRes = Experience.createDraft({
      senderId: dto.senderId,
      title: dto.title,
      relationship: relRes.value,
      occasion: occRes.value,
      gesture,
      burnOnRead: dto.burnOnRead,
    });

    if (expRes.isFailure) return Result.fail(expRes.error);

    const experience = expRes.value;
    await this.expRepo.save(experience);

    return Result.ok(experience);
  }
}
