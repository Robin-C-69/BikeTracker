import { SQLiteDatabase } from "expo-sqlite";
import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";
import { MAINTENANCE_TYPE_TABLE_NAME } from "@/database/migrations/tables";
import { BaseRepository } from "@/database/repositories/BaseRepository";

export class MaintenanceTypeRepository extends BaseRepository<MaintenanceType> {
  constructor(db: SQLiteDatabase) {
    super(db, MAINTENANCE_TYPE_TABLE_NAME);
  }
}
