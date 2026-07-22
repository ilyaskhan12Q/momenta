export class Result<T, E extends Error = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {
    Object.freeze(this);
  }

  public static ok<T, E extends Error = Error>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T, E extends Error = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get value(): T {
    if (!this._isSuccess) {
      const errMsg = this._error?.message ?? String(this._error);
      throw new Error(`Cannot retrieve value from a failed Result: ${errMsg}`);
    }
    return this._value as T;
  }

  public get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot retrieve error from a successful Result');
    }
    return this._error as E;
  }
}
