import { IExperienceRepository } from '../../domain/repositories/IExperienceRepository';
import { Experience } from '../../domain/entities/Experience';
import { Scene, SceneBeat, SceneTransitionType } from '../../domain/models/Scene';
import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ForbiddenError, ValidationError } from '../../../../shared/errors/AppError';

export interface AppendSceneDTO {
  experienceId: string;
  senderId: string;
  sequenceOrder: number;
  durationMs?: number;
  transition?: SceneTransitionType;
  beats: (string | SceneBeat)[];
}

export class AppendSceneUseCase {
  constructor(private readonly expRepo: IExperienceRepository) {}

  public async execute(dto: AppendSceneDTO): Promise<Result<Experience, AppError>> {
    const experience = await this.expRepo.findById(dto.experienceId);
    if (!experience) {
      return Result.fail(new NotFoundError(`Experience ${dto.experienceId} not found`));
    }

    if (experience.senderId !== dto.senderId) {
      return Result.fail(new ForbiddenError('You are not authorized to update this experience'));
    }

    const formattedBeats: SceneBeat[] = dto.beats.map((b, idx) => {
      if (typeof b === 'string') {
        return {
          id: `beat-${dto.sequenceOrder}-${idx}`,
          type: 'PARAGRAPH',
          content: b,
        };
      }
      return b;
    });

    const scene = Scene.create({
      id: `scene-${dto.sequenceOrder}-${Date.now()}`,
      sequenceOrder: dto.sequenceOrder,
      durationMs: dto.durationMs || 4000,
      transition: dto.transition || 'FADE_UP',
      beats: formattedBeats,
    });

    const res = experience.appendScene(scene);
    if (res.isFailure) {
      return Result.fail(res.error);
    }

    await this.expRepo.save(experience);
    return Result.ok(experience);
  }
}
