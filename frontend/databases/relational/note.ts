import { devLog } from "@/utils/dev";
import type { PublicNote } from "@/utils/types";
import type { SQLiteDatabase } from "expo-sqlite";

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

export class NoteDb {
  public constructor(private readonly db: SQLiteDatabase) {}

  public findAll() {
    try {
      const dbNotes = this.db.getAllSync<DbNote>(
        "select * from notes order by created_at desc",
      );

      devLog(`NoteDb.findAll: ${dbNotes.length} notes found`);
      return dbNotes.map(NoteDb.normalize);
    } catch (error) {
      devLog(`NoteDb.findAll: ${error}`);
      return [];
    }
  }

  public findOneById(id: string) {
    try {
      const dbNote = this.db.getFirstSync<DbNote>(
        "select * from notes where id = ?",
        id,
      );

      devLog(
        dbNote
          ? `NoteDb.findOneById: note ${id} found`
          : `NoteDb.findOneById: note ${id} not found`,
      );
      return dbNote ? NoteDb.normalize(dbNote) : null;
    } catch (error) {
      devLog(`NoteDb.findOneById: ${error}`);
      return null;
    }
  }

  public async insertOne(note: PublicNote) {
    try {
      const { changes, lastInsertRowId } = await this.db.runAsync(
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
        `NoteDb.insertOne: ${changes} note(s) inserted, last inserted row: ${lastInsertRowId}`,
      );
    } catch (error) {
      devLog(`NoteDb.insertOne: ${error}`);
      return;
    }
  }

  public async deleteAll() {
    try {
      const { changes } = await this.db.runAsync("delete from notes");

      devLog(`NoteDb.deleteAll: ${changes} note(s) deleted`);
    } catch (error) {
      devLog(`NoteDb.deleteAll: ${error}`);
      return;
    }
  }

  public async deleteOneById(id: string) {
    try {
      const { changes } = await this.db.runAsync(
        "delete from notes where id = ?",
        id,
      );

      devLog(`NoteDb.deleteOneById: ${changes} note(s) deleted`);
    } catch (error) {
      devLog(`NoteDb.deleteOneById: ${error}`);
      return;
    }
  }

  private static normalize(dbNote: DbNote) {
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
}
