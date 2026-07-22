import { ValueObject } from '@/shared/domain/ValueObject';

export class UserId extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(id?: string): UserId {
    return new UserId({ value: id || crypto.randomUUID() });
  }
}
