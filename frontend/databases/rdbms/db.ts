import { devLog } from "@/utils/dev";
import * as Sqlite from "expo-sqlite";

devLog("sqlite initializing");

export const db = Sqlite.openDatabaseSync("secretNote");

devLog("sqlite initialized, bootstrapping");

db.runSync(
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

devLog("sqlite bootstrapped");
