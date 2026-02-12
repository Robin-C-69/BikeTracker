import { SQLiteDatabase } from "expo-sqlite";
import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";
import { MAINTENANCE_TYPE_TABLE_NAME } from "@/database/migrations/tables";
import { BaseRepository } from "@/database/repositories/BaseRepository";

export class MaintenanceTypeRepository extends BaseRepository<MaintenanceType> {
  constructor(db: SQLiteDatabase) {
    super(db, MAINTENANCE_TYPE_TABLE_NAME);
  }

  // async findAllMaintenanceTypes(): Promise<MaintenanceType[]> {
  //   const results = await this.db.getAllAsync(
  //     `SELECT id, name
  //       FROM ${MAINTENANCE_TYPE_TABLE_NAME}
  //       ORDER BY name ASC`,
  //   );
  //   return results as MaintenanceType[];
  // }

  // async findMaintenanceTypeById(id: number): Promise<MaintenanceType | null> {
  //   const result = await this.db.getFirstAsync(
  //     `SELECT id, name
  //      FROM ${MAINTENANCE_TYPE_TABLE_NAME}
  //      WHERE id = ?`,
  //     id,
  //   );
  //   return (result as MaintenanceType) || null;
  // }
}
