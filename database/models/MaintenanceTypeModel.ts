/**
 * Maintenance type lists all maintenances available for any category of the bike
 */
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
