import { BikeRepository } from "@/api/repositories/BikeRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { BikeModel, IBike, ICreateBikeRequest } from "@/api/models/BikeModel";

export class BikeService {
  private bikeRepository: BikeRepository;

  constructor(db: SQLiteDatabase) {
    this.bikeRepository = new BikeRepository(db);
  }

  async getAllBikes(page: number = 1, limit: number = 10): Promise<IBike[]> {
    const offset = (page - 1) * limit;
    return await this.bikeRepository.findAll(limit, offset);
  }

  async getBikeById(id: number): Promise<IBike | null> {
    return await this.bikeRepository.findById(id);
  }

  async createBike(bike: ICreateBikeRequest): Promise<number> {
    const errors = BikeModel.validate(bike);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + errors.join(", "));
    }
    return await this.bikeRepository.create(bike);
  }

  async updateBike(id: number, bike: ICreateBikeRequest): Promise<void> {
    const errors = BikeModel.validate(bike);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + errors.join(", "));
    }
    const bikeToUpdate = await this.bikeRepository.findById(id);
    if (!bikeToUpdate) {
      throw new Error(`Bike with id ${id} not found.`);
    }
    await this.bikeRepository.update(id, bike);
  }

  async deleteBike(id: number): Promise<void> {
    const bikeToDelete = await this.bikeRepository.findById(id);
    if (!bikeToDelete) {
      throw new Error(`Bike with id ${id} not found.`);
    }
    await this.bikeRepository.deleteById(id);
  }
}
