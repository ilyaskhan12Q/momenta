import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type OccasionCategory = 'ANNIVERSARY' | 'BIRTHDAY' | 'CONDOLENCE' | 'APOLOGY' | 'VALENTINE' | 'JUST_BECAUSE';

export class OccasionType extends ValueObject<{ value: OccasionCategory }> {
  private constructor(value: OccasionCategory) {
    super({ value });
  }

  public get value(): OccasionCategory {
    return this.props.value;
  }

  public static create(category: string): Result<OccasionType, ValidationError> {
    const valid: OccasionCategory[] = ['ANNIVERSARY', 'BIRTHDAY', 'CONDOLENCE', 'APOLOGY', 'VALENTINE', 'JUST_BECAUSE'];
    if (!valid.includes(category as OccasionCategory)) {
      return Result.fail(new ValidationError(`Invalid occasion category: ${category}`));
    }
    return Result.ok(new OccasionType(category as OccasionCategory));
  }
}
