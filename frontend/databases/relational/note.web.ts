import { devLog } from "@/utils/dev";

export class NoteDb {
  public findAll() {
    devLog("NoteDb.findAll: not implemented for web");
    return [];
  }

  public findOneById() {
    devLog("NoteDb.findOneById: not implemented for web");
    return null;
  }

  public async upsertOne() {
    devLog("NoteDb.upsertOne: not implemented for web");
  }

  public async upsertMany() {
    devLog("NoteDb.upsertMany: not implemented for web");
  }

  public async deleteAll() {
    devLog("NoteDb.deleteAll: not implemented for web");
  }

  public async deleteOneById() {
    devLog("NoteDb.deleteOneById: not implemented for web");
  }
}
