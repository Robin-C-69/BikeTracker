import { BaseRepository } from "@/api/repositories/BaseRepository";
import {
  IBike,
  ICreateBikeRequest,
  IUpdateBikeRequest,
} from "@/api/models/BikeModel";
import { SQLiteDatabase } from "expo-sqlite";
import { BIKES_TABLE_NAME } from "@/api/services/constants";

interface IBikeRepository {
  create(bikeData: ICreateBikeRequest): Promise<IBike>;

  update(
    id: number,
    bikeData: Partial<IUpdateBikeRequest>,
  ): Promise<IBike | null>;
}

export class BikeRepository
  extends BaseRepository<IBike>
  implements IBikeRepository
{
  constructor(database: SQLiteDatabase) {
    super(database, BIKES_TABLE_NAME);
  }

  async create(bikeData: ICreateBikeRequest): Promise<IBike> {
    try {
      const result = await this.db.runAsync(
        "INSERT INTO bikes (name, brand, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))",
        [bikeData.name, bikeData.brand],
      );
      if (result.lastInsertRowId) {
        const newBike = await this.findById(result.lastInsertRowId as number);
        if (newBike) return newBike;
      }
      throw new Error("Failed to retrieve the newly created bike.");
    } catch (error) {
      console.error("Error creating new bike:", error);
      throw error;
    }
  }

  async update(
    id: number,
    bikeData: Partial<IUpdateBikeRequest>,
  ): Promise<IBike | null> {
    try {
      const existingBike = await this.findById(id);
      if (!existingBike) {
        throw new Error(`Bike with id ${id} not found.`);
      }

      const updatedName = bikeData.name || existingBike.name;
      const updatedBrand = bikeData.brand || existingBike.brand;

      await this.db.runAsync(
        "UPDATE bikes SET name = ?, brand = ?, updated_at = datetime('now') WHERE id = ?",
        [updatedName, updatedBrand, id],
      );

      return this.findById(id);
    } catch (error) {
      console.error(`Error updating bike with id ${bikeData.id}:`, error);
      throw error;
    }
  }
}
