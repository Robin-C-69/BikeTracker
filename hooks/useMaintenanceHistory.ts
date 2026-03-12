import { useCallback, useMemo } from "react";
import { useDatabase } from "@/context/DatabaseContext";
import { MaintenanceHistoryService } from "@/database/services/MaintenanceHistoryService";
import { CreateMaintenanceHistory } from "@/database/models/MaintenanceHistoryModel";
import { useMaintenanceHistoryStore } from "@/stores/historyStore";
import { MaintenanceTypeRepository } from "@/database/repositories/MaintenanceTypeRepository";

export const useMaintenanceHistory = () => {
  const { db } = useDatabase();
  const { addHistoryEntry } = useMaintenanceHistoryStore();

  const maintenanceHistoryService = useMemo(() => {
    if (!db) return;
    return new MaintenanceHistoryService(db);
  }, [db]);

  const createHistoryEntry = useCallback(
    async (data: CreateMaintenanceHistory) => {
      if (!maintenanceHistoryService || !db) return null;
      const { error, data: newHistoryEntry } =
        await maintenanceHistoryService.createHistoryEntry(data);
      if (error) {
        return null;
      }

      const typeRepo = new MaintenanceTypeRepository(db);
      const maintenanceType = await typeRepo.findById(
        newHistoryEntry.maintenanceTypeId,
      );
      if (maintenanceType) {
        addHistoryEntry(data.pieceId, { ...newHistoryEntry, maintenanceType });
      }

      return newHistoryEntry;
    },
    [addHistoryEntry, db, maintenanceHistoryService],
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
