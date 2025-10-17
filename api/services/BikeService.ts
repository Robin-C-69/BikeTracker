import {BikeRepository} from "@/api/repositories/BikeRepository";
import {SQLiteDatabase} from "expo-sqlite";
import {BikeModel, IBike, ICreateBikeRequest, IUpdateBikeRequest} from "@/api/models/BikeModel";

export class BikeService {
  private bikeRepository: BikeRepository;

  constructor(db: SQLiteDatabase) {
    this.bikeRepository = new BikeRepository(db);
  }

  async getAllBikes(page: number = 1, limit: number = 10): Promise<{
    bikes: IBike[];
    hasMore: boolean;
  }> {
    try {
      const offset = (page - 1) * limit;
      const bikes = await this.bikeRepository.findAll(limit + 1, offset); //Get one extra to check if there's more

      const hasMore = bikes.length > limit;
      if (hasMore) bikes.pop(); //Remove the extra bike if exists

      return {bikes, hasMore};
    } catch (error) {
      throw error;
    }
  }

  async getBikeById(id: number): Promise<IBike | null> {
    try {
      return await this.bikeRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createBike(bike: ICreateBikeRequest): Promise<{ bike?: IBike, errors?: string[] }> {
    try {
      // Validate input
      const errors = BikeModel.validate(bike);
      if (errors.length > 0) {
        return {errors};
      }

      const newBike = await this.bikeRepository.create(bike);
      return {bike: newBike};
    } catch (error) {
      throw error;
    }
  }

  async updateBike(id: number, bike: Partial<IUpdateBikeRequest>): Promise<{ bike?: IBike, errors: string[] }> {
    try {
      // Check if bike already exists
      const existingBike = await this.bikeRepository.findById(id);
      if (!existingBike) {
        return {errors: [`Bike with id ${id} not found.`]};
      }

      const updatedBike = await this.bikeRepository.update(id, bike);
      if (!updatedBike) {
        return {errors: [`Failed to update bike with id ${id}.`]};
      }
      return {bike: updatedBike, errors: []};
    } catch (error) {
      throw error;
    }
  }

  async deleteBike(id: number): Promise<boolean> {
    try {
      return await this.bikeRepository.deleteById(id);

    } catch (error) {
      throw error;
    }
  }
}