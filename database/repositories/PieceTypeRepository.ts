import { SQLiteDatabase } from "expo-sqlite";
import { PieceType } from "@/database/models/PieceTypeModel";
import { PIECE_TYPES_TABLE_NAME } from "@/database/migrations/tables";

export class PieceTypeRepository {
  protected db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async findTypeById(id: number): Promise<PieceType | null> {
    const result = await this.db.getFirstAsync(
      `SELECT *
       FROM ${PIECE_TYPES_TABLE_NAME}
       WHERE id = ?`,
      id,
    );
    return (result as PieceType) || null;
  }
}
