import { PieceType } from "@/database/models/PieceTypeModel";

export type Category = {
  id: number;
  typeId: number;
  name: string;
  description: string;
};

export interface PieceCategoryWithType extends Category {
  type: PieceType;
}

export type CreateCategory = {
  typeId: number;
  name: string;
  description: string;
};
