import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { Category } from "@/database/models/PieceCategoryModel";
import { PieceType } from "@/database/models/PieceTypeModel";

export type Piece = {
  id: number;
  bike_id: number;
  category_id: number;
  name: string;
  description?: string;
  install_date?: string;
  install_km?: number;
  created_at: string;
  updated_at: string;
};
export interface PieceCategoryWithType extends Category {
  type: PieceType;
}

export interface PieceWithDetails extends Piece {
  category: PieceCategoryWithType;
  maintenance_history: MaintenanceHistoryWithType[];
}

export type CreatePiece = {
  bike_id: number;
  category_id: number;
  name: string;
  description?: string;
  install_date?: string;
  install_km?: number;
};

export type UpdatePiece = {
  name?: string;
  description?: string;
  install_date?: string;
  install_km?: number;
  updated_at?: string;
};
