import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';
import { StoryManifestV1 } from '../contracts/StoryManifestV1';

export class ManifestValidationSpec {
  isSatisfiedBy(manifest: StoryManifestV1): Result<boolean, ValidationError> {
    if (!manifest || manifest.manifestVersion !== '1.0.0') {
      return Result.fail(new ValidationError('ManifestValidationSpec failed: manifestVersion must be 1.0.0'));
    }
    if (!manifest.manifestId || !manifest.experienceId || !manifest.linkToken) {
      return Result.fail(new ValidationError('ManifestValidationSpec failed: missing required IDs or linkToken'));
    }
    if (!manifest.scenes || manifest.scenes.length < 2) {
      return Result.fail(new ValidationError('ManifestValidationSpec failed: manifest must contain at least 2 scenes'));
    }
    if (!manifest.presentation || !manifest.checksum) {
      return Result.fail(new ValidationError('ManifestValidationSpec failed: presentation or checksum missing'));
    }
    return Result.ok(true);
  }
}
