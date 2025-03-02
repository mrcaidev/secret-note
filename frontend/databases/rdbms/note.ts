import { devLog } from "@/utils/dev";
import type { PublicNote } from "@/utils/types";
import { db } from "./db";

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
  const dbNotes = db.getAllSync<DbNote>("select * from notes");

  devLog(`${dbNotes.length} notes found`);

  return dbNotes.map(normalize);
}

export function findOneById(id: string) {
  const dbNote = db.getFirstSync<DbNote>(
    "select * from notes where id = ?",
    id,
  );

  devLog(dbNote ? `note ${id} found` : `note ${id} not found`);

  return dbNote ? normalize(dbNote) : null;
}

export async function insertOne(note: PublicNote) {
  const { changes, lastInsertRowId } = await db.runAsync(
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

  devLog(`${changes} note(s) inserted, last inserted row: ${lastInsertRowId}`);
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
