import { useCallback, useMemo } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import { MaintenanceHistoryService } from "@/database/services/MaintenanceHistoryService";
import { CreateMaintenanceHistory } from "@/database/models/MaintenanceHistoryModel";

export const useMaintenanceHistory = () => {
  const { db } = useDatabase();

  const maintenanceHistoryService = useMemo(() => {
    if (!db) return;
    return new MaintenanceHistoryService(db);
  }, [db]);

  const createHistoryEntry = useCallback(
    async (data: CreateMaintenanceHistory) => {
      if (!maintenanceHistoryService) return null;
      const { error, data: newHistoryEntry } =
        await maintenanceHistoryService.createHistoryEntry(data);
      if (error) {
        return null;
      }
      return newHistoryEntry;
    },
    [maintenanceHistoryService],
  );

  const updateHistoryEntry = useCallback(
    async (id: number, data: CreateMaintenanceHistory) => {
      if (!maintenanceHistoryService) return null;
      const { error, data: newHistoryEntry } =
        await maintenanceHistoryService.updateHistoryEntry({ id, data });
      if (error) {
        return null;
      }
      return newHistoryEntry;
    },
    [maintenanceHistoryService],
  );

  return {
    createHistoryEntry,
    updateHistoryEntry,
  };
};
