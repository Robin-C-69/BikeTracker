import { CreatePiece, Piece, UpdatePiece } from "@/database/models/PieceModel";
import { BaseRepository } from "@/database/repositories/BaseRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { PIECES_TABLE_NAME } from "@/database/migrations/tables";

export class PieceRepository extends BaseRepository<Piece> {
  constructor(database: SQLiteDatabase) {
    super(database, PIECES_TABLE_NAME);
  }

  async create(data: CreatePiece): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO ${PIECES_TABLE_NAME} (bikeId, categoryId, name, description, installDate, installKm, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        data.bikeId,
        data.categoryId,
        data.name,
        data.description || null,
        data.installDate || null,
        data.installKm || null,
      ],
    );
    return result.lastInsertRowId;
  }

  async update(id: number, data: UpdatePiece): Promise<number> {
    data.updatedAt = new Date().toISOString();
    const fields = Object.keys(data);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${PIECES_TABLE_NAME} SET ${setClause} WHERE id = ?`;
    const result = await this.db.runAsync(sql, values);
    return result.lastInsertRowId;
  }

  async findByBikeId(bikeId: number): Promise<Piece[]> {
    const results = await this.db.getAllAsync(
      `SELECT *
       FROM ${PIECES_TABLE_NAME}
       WHERE bikeId = ?
       ORDER BY id DESC`,
      bikeId,
    );
    return results as Piece[];
  }
}
