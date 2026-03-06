export type MaintenanceType = {
  id: number;
  name: string;
  description: string;
  recommendedKm: number;
  recommendedDays: number;
};

export type CreateMaintenanceType = {
  name: string;
  description: string;
  recommendedKm: number;
  recommendedDays: number;
};
