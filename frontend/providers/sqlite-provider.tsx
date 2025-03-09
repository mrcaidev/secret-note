import { sqliteEncryptionKeyDb } from "@/databases/kv";
import { devLog } from "@/utils/dev";
import * as Crypto from "expo-crypto";
import {
  type SQLiteDatabase,
  SQLiteProvider,
  useSQLiteContext,
} from "expo-sqlite";
import type { PropsWithChildren } from "react";

export function SqliteProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName="secret-note.db" onInit={init}>
      {children}
    </SQLiteProvider>
  );
}

export function useSqlite() {
  return useSQLiteContext();
}

async function init(db: SQLiteDatabase) {
  try {
    devLog("SqliteProvider: initializing");

    const encryptionKey = await readEncryptionKey();
    await db.runAsync(`pragma key = '${encryptionKey}'`);
    devLog(`SqliteProvider: set encryption key to ${encryptionKey}`);

    await db.runAsync("pragma journal_mode = WAL");
    devLog("SqliteProvider: set journal mode to WAL");

    await db.runAsync(
      `create table if not exists notes (
        id text primary key,
        title text not null,
        content text not null,
        author_id text not null,
        author_nickname text not null,
        author_avatar_url text not null,
        link text not null,
        created_at text not null
      )`,
    );
    devLog("SqliteProvider: created tables");

    devLog("SqliteProvider: initialized");
  } catch (error) {
    devLog("SqliteProvider: failed to initialize:", error);
  }
}

async function readEncryptionKey() {
  const key = await sqliteEncryptionKeyDb.get();

  if (key) {
    return key;
  }

  devLog("SqliteProvider: no existing encryption key, creating one");
  const newKey = Crypto.randomUUID();
  sqliteEncryptionKeyDb.set(newKey);
  return newKey;
}
