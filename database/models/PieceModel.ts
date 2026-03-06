import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { PieceCategoryWithType } from "@/database/models/PieceCategoryModel";

export type Piece = {
  id: number;
  bikeId: number;
  categoryId: number;
  name: string;
  description?: string;
  installDate: string;
  installKm?: number;
  createdAt: string;
  updatedAt: string;
};

export interface PieceWithDetails extends Piece {
  category: PieceCategoryWithType;
  maintenanceHistory: MaintenanceHistoryWithType[];
}

export type CreatePiece = {
  bikeId: number;
  categoryId: number;
  name: string;
  description?: string;
  installDate?: string;
  installKm?: number;
};

export type UpdatePiece = {
  name?: string;
  description?: string;
  installDate?: string;
  installKm?: number;
  updatedAt?: string;
};
