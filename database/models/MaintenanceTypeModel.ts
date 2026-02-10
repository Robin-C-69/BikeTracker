export type MaintenanceType = {
  id: number;
  name: string;
  description: string;
  recommended_km: number;
  recommended_days: number;
};

export type CreateMaintenanceType = {
  name: string;
  description: string;
  recommended_km: number;
  recommended_days: number;
};
