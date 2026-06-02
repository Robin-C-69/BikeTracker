import { BaseRepository } from "@/database/repositories/BaseRepository";
import { Bike, CreateBikeRequest } from "@/database/models/BikeModel";
import { SQLiteDatabase } from "expo-sqlite";
import { BIKES_TABLE_NAME } from "@/database/migrations/tables";

interface IBikeRepository {
  create(bikeData: CreateBikeRequest): Promise<number>;

  update(id: number, bikeData: CreateBikeRequest): Promise<number>;
}

export class BikeRepository
  extends BaseRepository<Bike>
  implements IBikeRepository
{
  constructor(database: SQLiteDatabase) {
    super(database, BIKES_TABLE_NAME);
  }

  async create(bikeData: CreateBikeRequest): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO ${BIKES_TABLE_NAME} (name, brand, model, totalKm, imageUri, createdAt, updatedAt) VALUES (?, ?, ?, ?,?, datetime('now'), datetime('now'))`,
      [
        bikeData.name,
        bikeData.brand ?? null,
        bikeData.model ?? null,
        bikeData.totalKm ?? 0,
        bikeData.imageUri ?? null,
      ],
    );
    return result.lastInsertRowId;
  }

  async update(id: number, bikeData: CreateBikeRequest): Promise<number> {
    const result = await this.db.runAsync(
      `UPDATE ${BIKES_TABLE_NAME}
       SET name       = ?,
           brand      = ?,
           model      = ?,
           totalKm   = ?,
           updatedAt = datetime('now')
       WHERE id = ?`,
      [
        bikeData.name,
        bikeData.brand ?? null,
        bikeData.model ?? null,
        bikeData.totalKm ?? 0,
        id,
      ],
    );
    return result.lastInsertRowId;
  }
}
