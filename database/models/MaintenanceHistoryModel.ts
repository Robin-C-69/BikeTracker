import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";

export type MaintenanceHistory = {
  id: number;
  piece_id: number;
  maintenance_type_id: number;
  date: string;
  km_at_maintenance?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export type CreateMaintenanceHistory = {
  piece_id: number;
  maintenance_type_id: number;
  date: string;
  km_at_maintenance?: number;
  notes?: string;
  updated_at?: string;
};

export interface MaintenanceHistoryWithType extends MaintenanceHistory {
  maintenance_type: MaintenanceType;
}
