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
      `INSERT INTO ${PIECES_TABLE_NAME} (bike_id, category_id, name, description, install_date, install_km, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        data.bike_id,
        data.category_id,
        data.name,
        data.description || null,
        data.install_date || null,
        data.install_km || null,
      ],
    );
    return result.lastInsertRowId;
  }

  async update(id: number, data: UpdatePiece): Promise<number> {
    data.updated_at = new Date().toISOString();
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
       WHERE bike_id = ?
       ORDER BY id DESC`,
      bikeId,
    );
    return results as Piece[];
  }
}
