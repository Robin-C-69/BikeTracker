export type Bike = {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  totalKm?: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateBikeRequest = {
  name: string;
  brand?: string;
  model?: string;
  totalKm?: number;
};

export class BikeModel {
  static validate(bike: CreateBikeRequest): string[] {
    const errors: string[] = [];

    if (bike.name.length === 0) {
      errors.push("Name is required");
    }

    return errors;
  }
}
