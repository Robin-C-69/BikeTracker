export type Bike = {
  id: number;
  name: string;
  brand?: string;
  model?: string;
  total_km?: number;
  created_at: string;
  updated_at: string;
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
