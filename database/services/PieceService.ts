import { PieceRepository } from "@/database/repositories/PieceRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";
import {
  CreatePiece,
  PieceWithDetails,
  UpdatePiece,
} from "@/database/models/PieceModel";
import { PieceCategoryRepository } from "@/database/repositories/PieceCategoryRepository";
import { PieceTypeRepository } from "@/database/repositories/PieceTypeRepository";
import { MaintenanceHistoryRepository } from "@/database/repositories/MaintenanceHistoryRepository";
import { MaintenanceTypeRepository } from "@/database/repositories/MaintenanceTypeRepository";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { PieceCategoryWithType } from "@/database/models/PieceCategoryModel";

interface IPieceService {
  getAllPieces({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel>;
  getPieceById(id: number): Promise<IResponseModel>;
  getPiecesByBike(bikeId: number): Promise<IResponseModel>;
  getPieceWithDetails(id: number): Promise<IResponseModel>;
  getAllPiecesWithDetails(): Promise<IResponseModel>;
  getPiecesByBikeWithDetails(bikeId: number): Promise<IResponseModel>;
  createPiece(data: CreatePiece): Promise<IResponseModel>;
  updatePiece({
    id,
    data,
  }: {
    id: number;
    data: UpdatePiece;
  }): Promise<IResponseModel>;
  deletePiece(id: number): Promise<IResponseModel>;
}

export class PieceService implements IPieceService {
  private pieceRepository: PieceRepository;
  private categoryRepository: PieceCategoryRepository;
  private typeRepository: PieceTypeRepository;
  private historyRepository: MaintenanceHistoryRepository;
  private maintenanceTypeRepository: MaintenanceTypeRepository;

  constructor(db: SQLiteDatabase) {
    this.pieceRepository = new PieceRepository(db);
    this.categoryRepository = new PieceCategoryRepository(db);
    this.typeRepository = new PieceTypeRepository(db);
    this.historyRepository = new MaintenanceHistoryRepository(db);
    this.maintenanceTypeRepository = new MaintenanceTypeRepository(db);
  }

  async getAllPieces({
    page,
    limit,
  }: {
    page?: number;
    limit?: number;
  }): Promise<IResponseModel> {
    const offset = page && limit ? (page - 1) * limit : 0;
    try {
      const pieces = await this.pieceRepository.findAll(limit, offset);
      return ResponseModel.createSuccess(pieces);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPieceById(id: number): Promise<IResponseModel> {
    try {
      const piece = await this.pieceRepository.findById(id);
      if (piece) {
        return ResponseModel.createSuccess(piece);
      } else {
        return ResponseModel.createError("Piece not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPiecesByBike(bikeId: number): Promise<IResponseModel> {
    try {
      const pieces = await this.pieceRepository.findByBikeId(bikeId);
      return ResponseModel.createSuccess(pieces);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPieceWithDetails(id: number): Promise<IResponseModel> {
    try {
      const piece = await this.pieceRepository.findById(id);
      if (!piece) {
        return ResponseModel.createError(`Piece with id ${id} not found`);
      }

      const category = await this.categoryRepository.findById(piece.categoryId);
      if (!category) {
        return ResponseModel.createError(
          `Category with ${piece.categoryId} not found`,
        );
      }

      const type = await this.typeRepository.findById(category.typeId);
      if (!type) {
        return ResponseModel.createError(
          `Type with ${category.typeId} not found`,
        );
      }

      const history = await this.historyRepository.findByPieceId(id);

      // Enrich history with maintenance types
      const historyWithTypes: MaintenanceHistoryWithType[] = await Promise.all(
        history.map(async (entry) => {
          const maintenanceType = await this.maintenanceTypeRepository.findById(
            entry.maintenanceTypeId,
          );
          return { ...entry, maintenanceType: maintenanceType! };
        }),
      );

      const categoryWithType: PieceCategoryWithType = { ...category, type };

      const pieceWithDetails: PieceWithDetails = {
        ...piece,
        category: categoryWithType,
        maintenanceHistory: historyWithTypes,
      };

      return ResponseModel.createSuccess(pieceWithDetails);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async getAllPiecesWithDetails(): Promise<IResponseModel> {
    try {
      const pieces = await this.pieceRepository.findAll();
      const piecesWithDetails = await Promise.all(
        pieces.map(async (piece) => {
          const result = await this.getPieceWithDetails(piece.id);
          if (!result.error) {
            return result.data as PieceWithDetails;
          } else {
            throw new Error(
              `Failed to get details for piece with id ${piece.id}`,
            );
          }
        }),
      );
      return ResponseModel.createSuccess(piecesWithDetails);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async getPiecesByBikeWithDetails(bikeId: number): Promise<IResponseModel> {
    try {
      const pieces = await this.pieceRepository.findByBikeId(bikeId);
      const piecesWithDetails = await Promise.all(
        pieces.map(async (piece) => {
          const result = await this.getPieceWithDetails(piece.id);
          if (result.error) {
            throw new Error(result.error);
          }
          return result.data as PieceWithDetails;
        }),
      );
      return ResponseModel.createSuccess(piecesWithDetails);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async createPiece(data: CreatePiece): Promise<IResponseModel> {
    try {
      const pieceId = await this.pieceRepository.create(data);
      const newPiece = await this.pieceRepository.findById(pieceId);
      return ResponseModel.createSuccess(newPiece);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async updatePiece({
    id,
    data,
  }: {
    id: number;
    data: UpdatePiece;
  }): Promise<IResponseModel> {
    const pieceToUpdate = await this.pieceRepository.findById(id);
    if (!pieceToUpdate) {
      return ResponseModel.createError(`Piece with id ${id} not found`);
    }

    try {
      await this.pieceRepository.update(id, data);
      const updatedPiece = await this.pieceRepository.findById(id);
      return ResponseModel.createSuccess(updatedPiece);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async deletePiece(id: number): Promise<IResponseModel> {
    const pieceToDelete = await this.pieceRepository.findById(id);
    if (!pieceToDelete) {
      return ResponseModel.createError(`Piece with id ${id} not found`);
    }

    try {
      await this.pieceRepository.deleteById(id);
      return ResponseModel.createSuccess(null);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async getPieceCountByBike(bikeId: number): Promise<IResponseModel> {
    try {
      const piecesCount = await this.pieceRepository.countByBikeId(bikeId);
      return ResponseModel.createSuccess(piecesCount);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }
}
