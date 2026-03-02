import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";

export type MaintenanceHistory = {
  id: number;
  pieceId: number;
  maintenanceTypeId: number;
  date: string;
  kmAtMaintenance?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateMaintenanceHistory = {
  pieceId: number;
  maintenanceTypeId: number;
  date: string;
  kmAtMaintenance?: number;
  notes?: string;
  updatedAt?: string;
};

export interface MaintenanceHistoryWithType extends MaintenanceHistory {
  maintenanceType: MaintenanceType;
}
