import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type OccasionCategory = 'ANNIVERSARY' | 'BIRTHDAY' | 'CONDOLENCE' | 'APOLOGY' | 'VALENTINE' | 'JUST_BECAUSE';

const OCCASION_SYNONYM_MAP: Record<string, OccasionCategory> = {
  GRATITUDE: 'JUST_BECAUSE',
  THANKYOU: 'JUST_BECAUSE',
  THANK_YOU: 'JUST_BECAUSE',
  JUSTBECAUSE: 'JUST_BECAUSE',
  JUST_BECAUSE: 'JUST_BECAUSE',
  MEMORIAL: 'CONDOLENCE',
  SORRY: 'APOLOGY',
  LOVE: 'VALENTINE',
};

export class OccasionType extends ValueObject<{ value: OccasionCategory }> {
  private constructor(value: OccasionCategory) {
    super({ value });
  }

  public get value(): OccasionCategory {
    return this.props.value;
  }

  public static create(category: string): Result<OccasionType, ValidationError> {
    const valid: OccasionCategory[] = ['ANNIVERSARY', 'BIRTHDAY', 'CONDOLENCE', 'APOLOGY', 'VALENTINE', 'JUST_BECAUSE'];
    const normalized = (category || '').toUpperCase().trim();
    const mapped = OCCASION_SYNONYM_MAP[normalized] || (normalized as OccasionCategory);

    if (!valid.includes(mapped)) {
      return Result.fail(new ValidationError(`Invalid occasion category: ${category}`));
    }
    return Result.ok(new OccasionType(mapped));
  }
}

