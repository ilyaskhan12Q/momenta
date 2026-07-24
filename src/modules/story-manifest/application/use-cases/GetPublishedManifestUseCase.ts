import { Result } from '../../../../shared/domain/Result';
import { AppError, NotFoundError, ValidationError } from '../../../../shared/errors/AppError';
import type { StoryManifestV1 } from '../../domain/contracts/StoryManifestV1';
import type { IManifestRepository } from '../../domain/repositories/IManifestRepository';

export class GetPublishedManifestUseCase {
  constructor(private readonly manifestRepo: IManifestRepository) {}

  async execute(linkToken: string): Promise<Result<StoryManifestV1, AppError>> {
    if (!linkToken || linkToken.trim().length === 0) {
      return Result.fail(new ValidationError('Link token cannot be empty'));
    }

    try {
      const manifest = await this.manifestRepo.findByToken(linkToken.trim());
      if (!manifest) {
        return Result.fail(new NotFoundError(`Published manifest for token ${linkToken} not found`));
      }
      return Result.ok(manifest);
    } catch (err) {
      if (err instanceof AppError) return Result.fail(err);
      return Result.fail(new ValidationError((err as Error).message));
    }
  }
}
