import { ValueObject } from '../../../../shared/domain/ValueObject';
import { Result } from '../../../../shared/domain/Result';
import { ValidationError } from '../../../../shared/errors/AppError';

export type RelationshipCategory = 'PARTNER' | 'PARENT' | 'CHILD' | 'SIBLING' | 'BEST_FRIEND' | 'MENTOR' | 'OTHER';

const SYNONYM_MAP: Record<string, RelationshipCategory> = {
  FRIEND: 'BEST_FRIEND',
  BESTFRIEND: 'BEST_FRIEND',
  BEST_FRIEND: 'BEST_FRIEND',
  TEACHER: 'MENTOR',
  GUIDE: 'MENTOR',
  BOSS: 'MENTOR',
  COACH: 'MENTOR',
  COLLEAGUE: 'OTHER',
  WORK: 'OTHER',
  MOTHER: 'PARENT',
  FATHER: 'PARENT',
  MOM: 'PARENT',
  DAD: 'PARENT',
  PAPA: 'PARENT',
  MAMA: 'PARENT',
  SISTER: 'SIBLING',
  BROTHER: 'SIBLING',
  SON: 'CHILD',
  DAUGHTER: 'CHILD',
  KID: 'CHILD',
  SPOUSE: 'PARTNER',
  LOVER: 'PARTNER',
  HUSBAND: 'PARTNER',
  WIFE: 'PARTNER',
  GIRLFRIEND: 'PARTNER',
  BOYFRIEND: 'PARTNER',
};

export class RelationshipIntent extends ValueObject<{ value: RelationshipCategory }> {
  private constructor(value: RelationshipCategory) {
    super({ value });
  }

  public get value(): RelationshipCategory {
    return this.props.value;
  }

  public static create(category: string): Result<RelationshipIntent, ValidationError> {
    const valid: RelationshipCategory[] = ['PARTNER', 'PARENT', 'CHILD', 'SIBLING', 'BEST_FRIEND', 'MENTOR', 'OTHER'];
    const normalized = (category || '').toUpperCase().trim();
    const mapped = SYNONYM_MAP[normalized] || (normalized as RelationshipCategory);

    if (!valid.includes(mapped)) {
      return Result.fail(new ValidationError(`Invalid relationship category: ${category}`));
    }
    return Result.ok(new RelationshipIntent(mapped));
  }
}

