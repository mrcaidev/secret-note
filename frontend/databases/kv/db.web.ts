import { BaseKvDb } from "./db.base";
import type { KvDbOptions } from "./types";

export class KvDb<T = string> extends BaseKvDb<T> {
  public constructor(key: string, options: KvDbOptions = {}) {
    super(key, options);
  }

  protected override async _get() {
    if (this.session) {
      return sessionStorage.getItem(this.key);
    }

    return localStorage.getItem(this.key);
  }

  protected override async _set(value: string) {
    if (this.session) {
      sessionStorage.setItem(this.key, value);
      return;
    }

    localStorage.setItem(this.key, value);
  }

  protected override async _remove() {
    if (this.session) {
      sessionStorage.removeItem(this.key);
      return;
    }

    localStorage.removeItem(this.key);
  }
}
