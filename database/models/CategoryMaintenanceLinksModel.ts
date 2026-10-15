/**
 * This mapset links maintenances that are available for a specific category
 */
export type CategoryMaintenanceLinks = {
  id: number;
  categoryId: number;
  maintenanceTypeId: number;
  recommendKm?: number;
  recommendedDays?: number;
}

export type CreateCategoryMaintenanceLink = {
  categoryId: number;
  maintenanceTypeId: number;
  recommendedKm?: number;
  recommendedDays?: number;
}