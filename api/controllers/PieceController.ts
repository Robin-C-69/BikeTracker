import { PieceService } from "@/api/services/PieceService";
import { ResponseModel } from "@/api/models/ResponseModel";
import { ICreatePieceRequest } from "@/api/models/PieceModel";

export class PieceController {
  private pieceService: PieceService;

  constructor(pieceService: PieceService) {
    this.pieceService = pieceService;
  }

  async getAllPieces({ page, limit }: { page?: number; limit?: number }) {
    try {
      const pieces = await this.pieceService.getAllPieces(page, limit);
      return ResponseModel.createSuccess(pieces);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPieceById(id: number) {
    try {
      const piece = await this.pieceService.getPieceById(id);
      if (piece) {
        return ResponseModel.createSuccess(piece);
      } else {
        return ResponseModel.createError("Piece not found");
      }
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async getPiecesByBikeId(bikeId: number) {
    try {
      const pieces = await this.pieceService.getPiecesByBikeId(bikeId);
      return ResponseModel.createSuccess(pieces);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async createPiece(pieceData: ICreatePieceRequest) {
    try {
      const pieceId = await this.pieceService.createPiece(pieceData);
      const piece = await this.pieceService.getPieceById(pieceId);
      return ResponseModel.createSuccess(piece);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async updatePiece({
    id,
    pieceData,
  }: {
    id: number;
    pieceData: ICreatePieceRequest;
  }) {
    try {
      await this.pieceService.updatePiece(id, pieceData);
      const updatedPiece = await this.pieceService.getPieceById(id);
      return ResponseModel.createSuccess(updatedPiece);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async deletePiece(id: number) {
    try {
      await this.pieceService.deletePiece(id);
      return ResponseModel.createSuccess(null);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
