export type MaintenanceType = {
  id: number;
  name: string;
  description: string;
  isCritical: boolean;
};

export type CreateMaintenanceType = {
  name: string;
  description: string;
  isCritical: boolean;
};
