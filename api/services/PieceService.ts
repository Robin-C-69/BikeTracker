import { PieceRepository } from "@/api/repositories/PieceRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { ICreatePieceRequest, PieceModel } from "@/api/models/PieceModel";
import { BikeRepository } from "@/api/repositories/BikeRepository";

export class PieceService {
  private pieceRepository: PieceRepository;
  private bikeRepository: BikeRepository;

  constructor(db: SQLiteDatabase) {
    this.pieceRepository = new PieceRepository(db);
    this.bikeRepository = new BikeRepository(db);
  }

  async getAllPieces(page?: number, limit?: number) {
    const offset = page && limit ? (page - 1) * limit : 0;
    return await this.pieceRepository.findAll(limit, offset);
  }

  async getPieceById(id: number) {
    return await this.pieceRepository.findById(id);
  }

  async getPiecesByBikeId(bikeId: number) {
    const bike = await this.bikeRepository.findById(bikeId);
    if (!bike) {
      throw new Error(`Bike with id ${bikeId} not found.`);
    }
    return await this.pieceRepository.findByBikeId(bikeId);
  }

  async createPiece(piece: ICreatePieceRequest) {
    const errors = PieceModel.validate(piece);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + errors.join(", "));
    }
    return await this.pieceRepository.create(piece);
  }

  async updatePiece(id: number, piece: ICreatePieceRequest) {
    const errors = PieceModel.validate(piece);
    if (errors.length > 0) {
      throw new Error("Validation failed: " + errors.join(", "));
    }
    const pieceToUpdate = await this.pieceRepository.findById(id);
    if (!pieceToUpdate) {
      throw new Error(`Piece with id ${id} not found.`);
    }
    await this.pieceRepository.update(id, piece);
  }

  async deletePiece(id: number) {
    const pieceToDelete = await this.pieceRepository.findById(id);
    if (!pieceToDelete) {
      throw new Error(`Piece with id ${id} not found.`);
    }
    await this.pieceRepository.deleteById(id);
  }
}
