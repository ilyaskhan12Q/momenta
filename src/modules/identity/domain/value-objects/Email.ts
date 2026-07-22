import { ValueObject } from '@/shared/domain/ValueObject';
import { Result } from '@/shared/domain/Result';
import { ValidationError } from '@/shared/errors/AppError';

export class Email extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(email: string): Result<Email, ValidationError> {
    if (!email) {
      return Result.fail(new ValidationError('Email is required'));
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return Result.fail(new ValidationError('Invalid email address format', { email }));
    }

    return Result.ok(new Email({ value: trimmed }));
  }
}
