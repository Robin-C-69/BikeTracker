import { SQLiteDatabase } from "expo-sqlite";
import { PieceType } from "@/database/models/PieceTypeModel";
import { PIECE_TYPES_TABLE_NAME } from "@/database/migrations/tables";
import { BaseRepository } from "@/database/repositories/BaseRepository";

export class PieceTypeRepository extends BaseRepository<PieceType> {
  constructor(db: SQLiteDatabase) {
    super(db, PIECE_TYPES_TABLE_NAME);
  }
}
