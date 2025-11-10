import { BikeService } from "@/api/services/BikeService";
import { ICreateBikeRequest } from "@/api/models/BikeModel";
import { IResponseModel, ResponseModel } from "@/api/models/ResponseModel";

export class BikeController {
  private bikeService: BikeService;

  constructor(bikeService: BikeService) {
    this.bikeService = bikeService;
  }

  async getAllBikes({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel> {
    try {
      const bikes = await this.bikeService.getAllBikes(page, limit);
      return ResponseModel.createSuccess(bikes);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getBikeById(id: number) {
    try {
      const bike = await this.bikeService.getBikeById(id);
      if (bike) {
        return ResponseModel.createSuccess(bike);
      } else {
        return ResponseModel.createError("Bike not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async createBike(bikeData: ICreateBikeRequest): Promise<IResponseModel> {
    try {
      const bikeId = await this.bikeService.createBike(bikeData);
      const bike = await this.bikeService.getBikeById(bikeId);
      return ResponseModel.createSuccess(bike);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async updateBike({
    id,
    bikeData,
  }: {
    id: number;
    bikeData: ICreateBikeRequest;
  }) {
    try {
      await this.bikeService.updateBike(id, bikeData);
      const updatedBike = await this.bikeService.getBikeById(id);
      return ResponseModel.createSuccess(updatedBike);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async deleteBike(id: number) {
    try {
      await this.bikeService.deleteBike(id);
      return ResponseModel.createSuccess(null);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
