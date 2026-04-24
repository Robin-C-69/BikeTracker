import { MAINTENANCE_HISTORY_TABLE_NAME } from "@/database/migrations/tables";
import { SQLiteDatabase } from "expo-sqlite";
import {
  CreateMaintenanceHistory,
  MaintenanceHistory,
} from "@/database/models/MaintenanceHistoryModel";
import { BaseRepository } from "@/database/repositories/BaseRepository";

interface IMaintenanceHistory {
  findByPieceId(pieceId: number): Promise<MaintenanceHistory[]>;
  create(data: CreateMaintenanceHistory): Promise<number>;
  update(id: number, data: Partial<CreateMaintenanceHistory>): Promise<number>;
}

export class MaintenanceHistoryRepository
  extends BaseRepository<MaintenanceHistory>
  implements IMaintenanceHistory
{
  constructor(database: SQLiteDatabase) {
    super(database, MAINTENANCE_HISTORY_TABLE_NAME);
  }

  async findByPieceId(pieceId: number): Promise<MaintenanceHistory[]> {
    const results = await this.db.getAllAsync(
      `SELECT *
       FROM ${MAINTENANCE_HISTORY_TABLE_NAME}
       WHERE pieceId = ?
       ORDER BY date DESC`,
      pieceId,
    );
    return results as MaintenanceHistory[];
  }

  async create(data: CreateMaintenanceHistory): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO ${MAINTENANCE_HISTORY_TABLE_NAME} (pieceId, maintenanceTypeId, date, kmAtMaintenance, notes, createdAt) VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [
        data.pieceId,
        data.maintenanceTypeId,
        data.date,
        data.kmAtMaintenance || null,
        data.notes || null,
      ],
    );
    return result.lastInsertRowId;
  }

  async update(
    id: number,
    data: Partial<CreateMaintenanceHistory>,
  ): Promise<number> {
    data.updatedAt = new Date().toISOString();
    const fields = Object.keys(data);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const values = [...Object.values(data), id];

    const sql = `UPDATE ${MAINTENANCE_HISTORY_TABLE_NAME} SET ${setClause} WHERE id = ?`;
    await this.db.runAsync(sql, values);
    return id;
  }
}
