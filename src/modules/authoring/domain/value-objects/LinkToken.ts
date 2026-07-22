import { ValueObject } from '../../../../shared/domain/ValueObject';

export class LinkToken extends ValueObject<{ value: string }> {
  private constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  public static create(token?: string): LinkToken {
    const val = token || crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    return new LinkToken(val);
  }
}
