import { PieceTypeRepository } from "@/database/repositories/PieceTypeRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";

export class PieceTypeService {
  private pieceTypeRepository: PieceTypeRepository;

  constructor(db: SQLiteDatabase) {
    this.pieceTypeRepository = new PieceTypeRepository(db);
  }

  async getAllPieceTypes({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel> {
    const offset = page && limit ? (page - 1) * limit : 0;
    try {
      const types = await this.pieceTypeRepository.findAll(limit, offset);
      return ResponseModel.createSuccess(types);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPieceTypeById(id: number): Promise<IResponseModel> {
    try {
      const type = await this.pieceTypeRepository.findById(id);
      if (type) {
        return ResponseModel.createSuccess(type);
      } else {
        return ResponseModel.createError("Piece type not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
