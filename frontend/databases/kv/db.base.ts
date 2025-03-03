import { devLog } from "@/utils/dev";
import type { KvDbOptions } from "./types";

export abstract class BaseKvDb<T> {
  protected readonly key: string;
  protected readonly secure: boolean;
  protected readonly session: boolean;

  protected constructor(key: string, options: KvDbOptions) {
    this.key = key;
    this.secure = options.secure ?? false;
    this.session = options.session ?? false;
  }

  protected abstract _get(): Promise<string | null>;

  public async get() {
    try {
      const text = await this._get();
      return text ? BaseKvDb.deserialize<T>(text) : null;
    } catch (error) {
      devLog(`failed to get ${this.key}: ${error}`);
      return null;
    }
  }

  protected abstract _set(value: string): Promise<void>;

  public async set(value: T) {
    try {
      const text = BaseKvDb.serialize<T>(value);
      await this._set(text);
    } catch (error) {
      devLog(`failed to set ${this.key}: ${error}`);
    }
  }

  protected abstract _remove(): Promise<void>;

  public async remove() {
    try {
      await this._remove();
    } catch (error) {
      devLog(`failed to remove ${this.key}: ${error}`);
    }
  }

  private static serialize<T>(value: T) {
    if (value === undefined) {
      return "undefined";
    }
    return JSON.stringify(value);
  }

  private static deserialize<T>(value: string) {
    if (value === "undefined") {
      return undefined as T;
    }
    return JSON.parse(value) as T;
  }
}
