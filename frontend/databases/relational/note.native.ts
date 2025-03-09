import { devLog } from "@/utils/dev";
import type { PublicNote } from "@/utils/types";
import { rdb } from "./db";

type DbNote = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_nickname: string;
  author_avatar_url: string;
  link: string;
  created_at: string;
};

export function findAll() {
  try {
    const dbNotes = rdb.getAllSync<DbNote>(
      "select * from notes order by created_at desc",
    );

    devLog(`noteDb: ${dbNotes.length} notes found`);

    return dbNotes.map(normalize);
  } catch {
    return [];
  }
}

export function findOneById(id: string) {
  try {
    const dbNote = rdb.getFirstSync<DbNote>(
      "select * from notes where id = ?",
      id,
    );

    devLog(
      dbNote ? `noteDb: note ${id} found` : `noteDb: note ${id} not found`,
    );

    return dbNote ? normalize(dbNote) : null;
  } catch {
    return null;
  }
}

export async function insertOne(note: PublicNote) {
  try {
    const { changes, lastInsertRowId } = await rdb.runAsync(
      "insert into notes values (?,?,?,?,?,?,?,?)",
      note.id,
      note.title,
      note.content,
      note.author.id,
      note.author.nickname,
      note.author.avatarUrl,
      note.link,
      note.createdAt,
    );

    devLog(
      `noteDb: ${changes} note(s) inserted, last inserted row: ${lastInsertRowId}`,
    );
  } catch {
    return;
  }
}

export async function deleteOneById(id: string) {
  try {
    const { changes } = await rdb.runAsync(
      "delete from notes where id = ?",
      id,
    );

    devLog(`noteDb: ${changes} note(s) deleted`);
  } catch {
    return;
  }
}

export async function deleteAll() {
  try {
    const { changes } = await rdb.runAsync("delete from notes");

    devLog(`noteDb: ${changes} note(s) deleted`);
  } catch {
    return;
  }
}

function normalize(dbNote: DbNote) {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    author: {
      id: dbNote.author_id,
      nickname: dbNote.author_nickname,
      avatarUrl: dbNote.author_avatar_url,
    },
    link: dbNote.link,
    createdAt: dbNote.created_at,
  } satisfies PublicNote;
}
