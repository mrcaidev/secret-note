import { devLog } from "@/utils/dev";
import * as Crypto from "expo-crypto";
import * as Sqlite from "expo-sqlite";
import { sqliteEncryptionKeyDb } from "../kv";

async function getEncryptionKey() {
  const key = await sqliteEncryptionKeyDb.get();

  if (key) {
    return key;
  }

  devLog("rdb: no sqlite encryption key, creating one");
  const newKey = Crypto.randomUUID();
  sqliteEncryptionKeyDb.set(newKey);
  return newKey;
}

devLog("rdb: opening sqlite");
export const rdb = Sqlite.openDatabaseSync("secretNote");
devLog("rdb: opened sqlite");

async function bootstrap() {
  devLog("rdb: bootstrapping sqlite");

  const encryptionKey = await getEncryptionKey();
  devLog(`rdb: encryption key: ${encryptionKey}`);

  rdb.runAsync(
    `
    pragma journal_mode = WAL;
    pragma key = ?;
    create table if not exists notes (
      id text primary key,
      title text not null,
      content text not null,
      author_id text not null,
      author_nickname text not null,
      author_avatar_url text not null,
      link text not null,
      created_at text not null
    );
    `,
    encryptionKey,
  );

  devLog("rdb: bootstrapped sqlite");
}

bootstrap();
