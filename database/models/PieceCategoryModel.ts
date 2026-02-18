import { PieceType } from "@/database/models/PieceTypeModel";

export type Category = {
  id: number;
  type_id: number;
  name: string;
  description: string;
};

export interface PieceCategoryWithType extends Category {
  type: PieceType;
}

export type CreateCategory = {
  type_id: number;
  name: string;
  description: string;
};
