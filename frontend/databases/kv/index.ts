import { KvDb } from "./db";

export const tokenDb = new KvDb<string>("token", {
  secure: true,
  session: false,
});
