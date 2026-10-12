import { MaintenanceHistoryRepository } from "@/database/repositories/MaintenanceHistoryRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";
import { CreateMaintenanceHistory } from "@/database/models/MaintenanceHistoryModel";
import { MaintenanceTypeRepository } from "@/database/repositories/MaintenanceTypeRepository";

export class MaintenanceHistoryService {
  private maintenanceHistoryRepository: MaintenanceHistoryRepository;
  private maintenanceTypeRepository: MaintenanceTypeRepository;

  constructor(db: SQLiteDatabase) {
    this.maintenanceHistoryRepository = new MaintenanceHistoryRepository(db);
    this.maintenanceTypeRepository = new MaintenanceTypeRepository(db);
  }

  async createHistoryEntry(
    data: CreateMaintenanceHistory,
  ): Promise<IResponseModel> {
    try {
      const id = await this.maintenanceHistoryRepository.create(data);
      const newEntry = await this.maintenanceHistoryRepository.findById(id);
      return ResponseModel.createSuccess(newEntry);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async getHistoryByPiece(pieceId: number): Promise<IResponseModel> {
    try {
      const history =
        await this.maintenanceHistoryRepository.findByPieceId(pieceId);

      const historyWithTypes = await Promise.all(
        history.map(async (entry) => {
          const maintenanceType = await this.maintenanceTypeRepository.findById(
            entry.maintenanceTypeId,
          );
          return { ...entry, maintenanceType: maintenanceType! };
        }),
      );
      return ResponseModel.createSuccess(historyWithTypes);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }

  async updateHistoryEntry({
    id,
    data,
  }: {
    id: number;
    data: Partial<CreateMaintenanceHistory>;
  }): Promise<IResponseModel> {
    try {
      const updatedId = await this.maintenanceHistoryRepository.update(
        id,
        data,
      );
      const updatedEntry =
        await this.maintenanceHistoryRepository.findById(updatedId);

      if (!updatedEntry) {
        return ResponseModel.createError(
          `History entry with id ${id} not found after update`,
        );
      }

      // Fetch the maintenanceType to satisfy MaintenanceHistoryWithType
      const maintenanceType = await this.maintenanceTypeRepository.findById(
        updatedEntry.maintenanceTypeId,
      );

      if (!maintenanceType) {
        return ResponseModel.createError(
          `Maintenance type not found for entry ${id}`,
        );
      }

      return ResponseModel.createSuccess({
        ...updatedEntry,
        maintenanceType: maintenanceType!,
      });
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }

  async deleteHistoryEntry({ id }: { id: number }): Promise<IResponseModel> {
    const historyToDelete =
      await this.maintenanceHistoryRepository.findById(id);
    if (!historyToDelete) {
      return ResponseModel.createError(`History entry with id ${id} not found`);
    }

    try {
      await this.maintenanceHistoryRepository.deleteById(id);
      return ResponseModel.createSuccess(null);
    } catch (e) {
      return ResponseModel.createError(e);
    }
  }
}
