import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type RelationshipCategory = 'PARTNER' | 'PARENT' | 'CHILD' | 'SIBLING' | 'BEST_FRIEND' | 'MENTOR' | 'OTHER';

export class RelationshipIntent extends ValueObject<{ value: RelationshipCategory }> {
  private constructor(value: RelationshipCategory) {
    super({ value });
  }

  public get value(): RelationshipCategory {
    return this.props.value;
  }

  public static create(category: string): Result<RelationshipIntent, ValidationError> {
    const valid: RelationshipCategory[] = ['PARTNER', 'PARENT', 'CHILD', 'SIBLING', 'BEST_FRIEND', 'MENTOR', 'OTHER'];
    if (!valid.includes(category as RelationshipCategory)) {
      return Result.fail(new ValidationError(`Invalid relationship category: ${category}`));
    }
    return Result.ok(new RelationshipIntent(category as RelationshipCategory));
  }
}
