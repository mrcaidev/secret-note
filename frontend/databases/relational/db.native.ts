import { devLog } from "@/utils/dev";
import * as Sqlite from "expo-sqlite";

devLog("rdb: sqlite initializing");

export const rdb = Sqlite.openDatabaseSync("secretNote");

devLog("rdb: sqlite initialized, bootstrapping");

rdb.runSync(
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

devLog("rdb: sqlite bootstrapped");
