import { KvDb } from "./db";

export const tokenDb = new KvDb<string>("token", {
  secure: true,
  session: false,
});

export const sqliteEncryptionKeyDb = new KvDb<string>("sqlite-encryption-key", {
  secure: true,
  session: false,
});
