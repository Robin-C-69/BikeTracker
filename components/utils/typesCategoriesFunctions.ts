import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { Piece } from "@/database/models/PieceModel";
import { initialCategoryMaintenanceLinks } from "@/database/seeds/initialData";

export const nextMaintenanceAction = (
  history: MaintenanceHistoryWithType[],
  piece: Piece,
) => {
  const lastCriticalMaintenance = history.find(
    (entry) => entry.maintenanceType.isCritical,
  );
  if (!lastCriticalMaintenance) return;

  const baseDate = new Date(lastCriticalMaintenance?.date ?? piece.installDate);

  const link = initialCategoryMaintenanceLinks.find(
    (l) => l.maintenanceTypeId === lastCriticalMaintenance.maintenanceTypeId,
  );
  if (!link?.recommendedDays) return null;

  const dueDate = new Date(
    baseDate.getTime() + link.recommendedDays * 24 * 60 * 60 * 1000,
  );

  return {
    maintenanceName: lastCriticalMaintenance.maintenanceType.name,
    dueDate,
  };
};

export const getCategoryNameById = (
  categoryId: number,
  pieceCategories: { id: number; name: string }[],
): string => {
  const category = pieceCategories.find((c) => c.id === categoryId);
  return category ? category.name : "";
};
