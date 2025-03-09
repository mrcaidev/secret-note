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

  public async upsertOne(note: PublicNote) {
    try {
      const { changes } = await this.db.runAsync(
        `
        insert into notes values (?,?,?,?,?,?,?,?)
        on conflict(id) do update set
        title = excluded.title,
        content = excluded.content,
        author_id = excluded.author_id,
        author_nickname = excluded.author_nickname,
        author_avatar_url = excluded.author_avatar_url,
        link = excluded.link,
        created_at = excluded.created_at
        `,
        [
          note.id,
          note.title,
          note.content,
          note.author.id,
          note.author.nickname,
          note.author.avatarUrl,
          note.link,
          note.createdAt,
        ],
      );

      devLog(`NoteDb.upsertOne: ${changes} note(s) upserted`);
    } catch (error) {
      devLog(`NoteDb.upsertOne: ${error}`);
      return;
    }
  }

  public async upsertMany(notes: PublicNote[]) {
    try {
      const { changes } = await this.db.runAsync(
        `
        insert into notes values ${Array(notes.length).fill("(?,?,?,?,?,?,?,?)").join(",")}
        on conflict(id) do update set
        title = excluded.title,
        content = excluded.content,
        author_id = excluded.author_id,
        author_nickname = excluded.author_nickname,
        author_avatar_url = excluded.author_avatar_url,
        link = excluded.link,
        created_at = excluded.created_at
        `,
        notes.flatMap((note) => [
          note.id,
          note.title,
          note.content,
          note.author.id,
          note.author.nickname,
          note.author.avatarUrl,
          note.link,
          note.createdAt,
        ]),
      );

      devLog(`NoteDb.upsertMany: ${changes} note(s) upserted`);
    } catch (error) {
      devLog(`NoteDb.upsertMany: ${error}`);
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
