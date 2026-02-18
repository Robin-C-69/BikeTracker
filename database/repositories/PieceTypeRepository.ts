import { SQLiteDatabase } from "expo-sqlite";
import { PieceType } from "@/database/models/PieceTypeModel";

export class PieceTypeRepository {
  protected db: SQLiteDatabase;

  constructor(db: SQLiteDatabase) {
    this.db = db;
  }

  async findAllTypes(): Promise<PieceType[]> {
    const results = await this.db.getAllAsync(
      `SELECT id, name
       FROM piece_types
       ORDER BY name ASC`,
    );
    return results as PieceType[];
  }

  async findTypeById(id: number): Promise<PieceType | null> {
    const result = await this.db.getFirstAsync(
      `SELECT id, name
       FROM piece_types
       WHERE id = ?`,
      id,
    );
    return (result as PieceType) || null;
  }
}
