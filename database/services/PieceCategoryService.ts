import { PieceCategoryRepository } from "@/database/repositories/PieceCategoryRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";

export class PieceCategoryService {
  private pieceCategoryRepository: PieceCategoryRepository;

  constructor(db: SQLiteDatabase) {
    this.pieceCategoryRepository = new PieceCategoryRepository(db);
  }

  async getAllPieceCategories({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel> {
    const offset = page && limit ? (page - 1) * limit : 0;
    try {
      const bikes = await this.pieceCategoryRepository.findAll(limit, offset);
      return ResponseModel.createSuccess(bikes);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPieceCategoryById(id: number): Promise<IResponseModel> {
    try {
      const bike = await this.pieceCategoryRepository.findById(id);
      if (bike) {
        return ResponseModel.createSuccess(bike);
      } else {
        return ResponseModel.createError("Category not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
