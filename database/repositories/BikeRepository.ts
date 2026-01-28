import { BaseRepository } from "@/database/repositories/BaseRepository";
import { IBike, ICreateBikeRequest } from "@/database/models/BikeModel";
import { SQLiteDatabase } from "expo-sqlite";
import { BIKES_TABLE_NAME } from "@/database/services/constants/tables";

interface IBikeRepository {
  create(bikeData: ICreateBikeRequest): Promise<number>;

  update(id: number, bikeData: ICreateBikeRequest): Promise<number>;
}

export class BikeRepository
  extends BaseRepository<IBike>
  implements IBikeRepository
{
  constructor(database: SQLiteDatabase) {
    super(database, BIKES_TABLE_NAME);
  }

  async create(bikeData: ICreateBikeRequest): Promise<number> {
    const result = await this.db.runAsync(
      `INSERT INTO ${BIKES_TABLE_NAME} (name, brand, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))`,
      [bikeData.name, bikeData.brand],
    );
    return result.lastInsertRowId;
  }

  async update(id: number, bikeData: ICreateBikeRequest): Promise<number> {
    const result = await this.db.runAsync(
      `UPDATE ${BIKES_TABLE_NAME} SET name = ?, brand = ?, updated_at = datetime('now') WHERE id = ?`,
      [bikeData.name, bikeData.brand, id],
    );
    return result.lastInsertRowId;
  }
}
