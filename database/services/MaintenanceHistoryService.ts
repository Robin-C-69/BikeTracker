import { MaintenanceHistoryRepository } from "@/database/repositories/MaintenanceHistoryRepository";
import { SQLiteDatabase } from "expo-sqlite";
import { IResponseModel, ResponseModel } from "@/database/models/ResponseModel";
import { CreateMaintenanceHistory } from "@/database/models/MaintenanceHistoryModel";

export class MaintenanceHistoryService {
  private maintenanceHistoryRepository: MaintenanceHistoryRepository;

  constructor(db: SQLiteDatabase) {
    this.maintenanceHistoryRepository = new MaintenanceHistoryRepository(db);
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
      return ResponseModel.createSuccess(updatedEntry);
    } catch (error) {
      return ResponseModel.createError(error);
    }
  }
}
