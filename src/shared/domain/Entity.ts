export abstract class Entity<T> {
  protected readonly _id: string;
  protected readonly props: T;

  constructor(props: T, id?: string) {
    this.props = props;
    this._id = id || crypto.randomUUID();
  }

  public get id(): string {
    return this._id;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (!(object instanceof Entity)) {
      return false;
    }
    return this._id === object._id;
  }
}
