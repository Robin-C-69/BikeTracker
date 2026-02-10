import { BikeRepository } from "@/database/repositories/BikeRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { BikeModel, ICreateBikeRequest } from "@/database/models/BikeModel";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";

export class BikeService {
  private bikeRepository: BikeRepository;

  constructor(db: SQLiteDatabase) {
    this.bikeRepository = new BikeRepository(db);
  }

  async getAllBikes({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel> {
    const offset = page && limit ? (page - 1) * limit : 0;
    try {
      const bikes = await this.bikeRepository.findAll(limit, offset);
      return ResponseModel.createSuccess(bikes);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getBikeById(id: number): Promise<IResponseModel> {
    try {
      const bike = await this.bikeRepository.findById(id);
      if (bike) {
        return ResponseModel.createSuccess(bike);
      } else {
        return ResponseModel.createError("Bike not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async createBike(bike: ICreateBikeRequest): Promise<IResponseModel> {
    const errors = BikeModel.validate(bike);
    if (errors.length > 0) {
      return ResponseModel.createError(
        "Validation failed: " + errors.join(", "),
      );
    }
    try {
      const bikeId = await this.bikeRepository.create(bike);
      const newBike = await this.bikeRepository.findById(bikeId);
      return ResponseModel.createSuccess(newBike);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async updateBike({
    id,
    bike,
  }: {
    id: number;
    bike: ICreateBikeRequest;
  }): Promise<IResponseModel> {
    const errors = BikeModel.validate(bike);
    if (errors.length > 0) {
      return ResponseModel.createError(
        "Validation failed: " + errors.join(", "),
      );
    }
    const bikeToUpdate = await this.bikeRepository.findById(id);
    if (!bikeToUpdate) {
      return ResponseModel.createError(`Bike with id ${id} not found.`);
    }
    try {
      const bikeId = await this.bikeRepository.update(id, bike);
      const updatedBike = await this.bikeRepository.findById(bikeId);
      return ResponseModel.createSuccess(updatedBike);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async deleteBike(id: number): Promise<IResponseModel> {
    const bikeToDelete = await this.bikeRepository.findById(id);
    if (!bikeToDelete) {
      return ResponseModel.createError(`Bike with id ${id} not found.`);
    }
    try {
      await this.bikeRepository.deleteById(id);
      return ResponseModel.createSuccess(null);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
