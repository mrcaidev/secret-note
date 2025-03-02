export type KvStorageOptions = {
  secure?: boolean;
  session?: boolean;
};

export abstract class BaseKvStorage<T> {
  protected readonly key: string;
  protected readonly secure: boolean;
  protected readonly session: boolean;

  protected constructor(key: string, options: KvStorageOptions) {
    this.key = key;
    this.secure = options.secure ?? false;
    this.session = options.session ?? false;
  }

  protected abstract _get(): Promise<string | null>;

  public async get() {
    const text = await this._get();
    return text ? this.deserialize(text) : null;
  }

  protected abstract _set(value: string): Promise<void>;

  public async set(value: T) {
    const text = this.serialize(value);
    await this._set(text);
  }

  protected abstract _remove(): Promise<void>;

  public async remove() {
    await this._remove();
  }

  private serialize(value: T) {
    if (value === undefined) {
      return "undefined";
    }
    return JSON.stringify(value);
  }

  private deserialize(value: string) {
    if (value === "undefined") {
      return undefined as T;
    }
    return JSON.parse(value) as T;
  }
}
