import { Experience } from '../entities/Experience';
import { Story } from '../entities/Story';
import { StoryLengthSpecification } from '../specifications/StoryLengthSpecification';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export class PublishingPolicy {
  public canPublish(experience: Experience): Result<void, ValidationError> {
    if (experience.scenes.length < 2) {
      return Result.fail(new ValidationError('Experience requires at least 2 timeline scenes to publish'));
    }

    if (experience.scenes.length > 10) {
      return Result.fail(new ValidationError('Experience cannot exceed 10 timeline scenes'));
    }

    const story = Story.create({ title: experience.title, scenes: experience.scenes });
    const lengthSpec = new StoryLengthSpecification();
    if (!lengthSpec.isSatisfiedBy(story)) {
      return Result.fail(
        new ValidationError(`Total story text exceeds max limit of ${StoryLengthSpecification.MAX_CHARACTERS} characters`)
      );
    }

    return Result.ok();
  }
}
