import { PieceType } from "@/database/models/PieceTypeModel";

/**
 * A category is the child element of a type.
 * It is related to its parent by the 'typeId'.
 * Eg: 'Chain' category is part of type 'Transmission'.
 */
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
