import { KvStorage } from "./kv";

export const tokenStorage = new KvStorage<string>("token", {
  secure: true,
  session: false,
});
