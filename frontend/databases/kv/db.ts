import type { KvDbOptions } from "./types";

export declare class KvDb<T = string> {
  public constructor(key: string, options?: KvDbOptions);
  public get(): Promise<T | null>;
  public set(value: T): Promise<void>;
  public remove(): Promise<void>;
}
