import * as SecureStore from "expo-secure-store";
import Sqlite from "expo-sqlite/kv-store";
import { BaseKvStorage, type KvStorageOptions } from "./kv.base";

export class KvStorage<T = string> extends BaseKvStorage<T> {
  public constructor(key: string, options: KvStorageOptions = {}) {
    super(key, options);

    if (this.session) {
      this.remove();
    }
  }

  protected override async _get() {
    if (this.secure) {
      return await SecureStore.getItemAsync(this.key);
    }

    return await Sqlite.getItemAsync(this.key);
  }

  protected override async _set(value: string) {
    if (this.secure) {
      await SecureStore.setItemAsync(this.key, value);
      return;
    }

    await Sqlite.setItemAsync(this.key, value);
  }

  protected override async _remove() {
    if (this.secure) {
      await SecureStore.deleteItemAsync(this.key);
      return;
    }

    await Sqlite.removeItemAsync(this.key);
  }
}
