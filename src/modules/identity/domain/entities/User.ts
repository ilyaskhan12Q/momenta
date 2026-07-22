import { AggregateRoot } from '@/shared/domain/AggregateRoot';
import { Result } from '@/shared/domain/Result';
import { ValidationError } from '@/shared/errors/AppError';
import { Email } from '../value-objects/Email';
import { UserRoleType } from '../value-objects/UserRole';
import { UserRegisteredEvent } from '../events/UserRegisteredEvent';

export interface UserProps {
  email: Email;
  displayName: string;
  role: UserRoleType;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public get email(): Email {
    return this.props.email;
  }

  public get displayName(): string {
    return this.props.displayName;
  }

  public get role(): UserRoleType {
    return this.props.role;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public static create(
    props: { email: Email; displayName: string; role?: UserRoleType },
    id?: string
  ): Result<User, ValidationError> {
    if (!props.displayName || props.displayName.trim() === '') {
      return Result.fail(new ValidationError('Display name is required'));
    }

    const now = new Date();
    const userProps: UserProps = {
      email: props.email,
      displayName: props.displayName.trim(),
      role: props.role ?? 'SENDER',
      createdAt: now,
      updatedAt: now,
    };

    const user = new User(userProps, id);

    if (!id) {
      user.addDomainEvent(new UserRegisteredEvent(user.id, user.email.value));
    }

    return Result.ok(user);
  }

  public static reconstitute(props: UserProps, id: string): User {
    return new User(props, id);
  }
}
