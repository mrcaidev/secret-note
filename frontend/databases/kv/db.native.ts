import * as SecureStore from "expo-secure-store";
import SqliteStore from "expo-sqlite/kv-store";
import { BaseKvDb } from "./db.base";
import type { KvDbOptions } from "./types";

export class KvDb<T = string> extends BaseKvDb<T> {
  public constructor(key: string, options: KvDbOptions = {}) {
    super(key, options);

    if (this.session) {
      this.remove();
    }
  }

  protected override async _get() {
    if (this.secure) {
      return await SecureStore.getItemAsync(this.key);
    }

    return await SqliteStore.getItemAsync(this.key);
  }

  protected override async _set(value: string) {
    if (this.secure) {
      await SecureStore.setItemAsync(this.key, value);
      return;
    }

    await SqliteStore.setItemAsync(this.key, value);
  }

  protected override async _remove() {
    if (this.secure) {
      await SecureStore.deleteItemAsync(this.key);
      return;
    }

    await SqliteStore.removeItemAsync(this.key);
  }
}
