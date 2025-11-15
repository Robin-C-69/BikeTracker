export interface IPiece {
  id: number;
  bikeId: number;
  category: string;
  subcategory: string;
  name: string;
  brand: string;
  model: string;
  status: string;
  attributes: string; // JSON string to store additional attributes
  created_at: string;
  updated_at: string;
}

export interface ICreatePieceRequest {
  bikeId: number;
  category: string;
  subcategory: string;
  name: string;
  brand: string;
  model: string;
  status: string;
  attributes: Record<string, any>; // JSON string to store additional attributes
}

export class PieceModel {
  static validate(piece: ICreatePieceRequest): string[] {
    const errors: string[] = [];

    if (piece.category.length === 0) {
      errors.push("Category is required");
    }

    if (!piece.bikeId || piece.bikeId <= 0) {
      errors.push("Valid Bike ID is required");
    }

    return errors;
  }
}
