import { BaseRepository } from "@/api/repositories/BaseRepository";
import { ICreatePieceRequest, IPiece } from "@/api/models/PieceModel";
import { SQLiteDatabase } from "expo-sqlite";
import { PIECES_TABLE_NAME } from "@/api/services/constants/tables";

interface IPieceRepository {
  findByBikeId(bikeId: number): Promise<IPiece[]>;
  create(pieceData: ICreatePieceRequest): Promise<number>;
  update(id: number, pieceData: ICreatePieceRequest): Promise<void>;
}

export class PieceRepository
  extends BaseRepository<IPiece>
  implements IPieceRepository
{
  constructor(database: SQLiteDatabase) {
    super(database, PIECES_TABLE_NAME);
  }

  async findByBikeId(bikeId: number): Promise<IPiece[]> {
    const rows = await this.db.getAllAsync<IPiece>(
      `SELECT * FROM ${PIECES_TABLE_NAME} WHERE bike_id = ?`,
      [bikeId],
    );
    return rows.map((row) => this.mapRowToModel(row));
  }

  async create(pieceData: ICreatePieceRequest): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO ${PIECES_TABLE_NAME} (bike_id, category, subcategory, name, brand, model, status, attributes,
                                         created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        pieceData.bikeId,
        pieceData.category,
        pieceData.subcategory,
        pieceData.name,
        pieceData.brand,
        pieceData.model,
        pieceData.status,
        pieceData.attributes,
      ],
    );
    return result.lastInsertRowId;
  }

  async update(id: number, pieceData: ICreatePieceRequest): Promise<void> {
    await this.db.runAsync(
      `UPDATE ${PIECES_TABLE_NAME}
       SET bike_id = ?, category = ?, subcategory = ?, name = ?, brand = ?, model = ?, status = ?, attributes = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [
        pieceData.bikeId,
        pieceData.category,
        pieceData.subcategory,
        pieceData.name,
        pieceData.brand,
        pieceData.model,
        pieceData.status,
        pieceData.attributes,
        id,
      ],
    );
  }

  private mapRowToModel(row: IPiece): IPiece {
    return {
      ...row,
      attributes: row.attributes ? JSON.parse(row.attributes as string) : {},
    };
  }
}
