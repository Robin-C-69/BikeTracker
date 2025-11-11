import { IBike, ICreateBikeRequest } from "@/api/models/BikeModel";
import { useDatabase } from "@/app/context/DatabaseContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BikeService } from "@/api/services/BikeService";
import { BikeController } from "@/api/controllers/BikeController";

interface UseBikeState {
  bikes: IBike[];
  loading: boolean;
  error: string | null;
}

interface UseBikeActions {
  createBike: (bike: ICreateBikeRequest) => Promise<IBike>;
  updateBike: (id: number, bike: ICreateBikeRequest) => Promise<IBike>;
  deleteBike: (id: number) => Promise<void>;
  getAllBikes: (page?: number, limit?: number) => Promise<IBike[]>;
  getBikeById: (id: number) => Promise<IBike | null>;
  refreshBikes: () => Promise<void>;
  clearError: () => void;
}

export const useBike = (): UseBikeState & UseBikeActions => {
  const { db } = useDatabase();
  const [state, setState] = useState<UseBikeState>({
    bikes: [],
    loading: false,
    error: null,
  });

  const bikeController = useMemo(() => {
    if (!db) return null;
    const bikeService = new BikeService(db);
    return new BikeController(bikeService);
  }, [db]);

  const updateState = useCallback((updates: Partial<UseBikeState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const getAllBikes = useCallback(
    async (page?: number, limit?: number) => {
      if (!bikeController) return;
      updateState({ loading: true, error: null });
      const { error, data } = await bikeController.getAllBikes({ page, limit });
      if (error) {
        updateState({ loading: false, error: error });
        return [];
      }
      updateState({ bikes: data, loading: false });
      return data;
    },
    [bikeController, updateState],
  );

  const getBikeById = useCallback(
    async (id: number) => {
      const cachedBike = state.bikes.find((bike) => bike.id === id);
      if (cachedBike) return cachedBike;

      if (!bikeController) return;
      updateState({ loading: true, error: null });
      const { error, data } = await bikeController.getBikeById(id);

      if (error) return null;

      setState((prev) => ({
        ...prev,
        loading: false,
        bikes: [...prev.bikes, data],
      }));
      return data;
    },
    [bikeController, state.bikes, updateState],
  );

  const createBike = useCallback(
    async (bike: ICreateBikeRequest) => {
      if (!bikeController) return;
      updateState({ loading: true, error: null });
      const { error, data: newBike } = await bikeController.createBike(bike);
      if (error) {
        updateState({ loading: false, error: error });
        return null;
      }
      await getAllBikes();
      updateState({ loading: false });
      return newBike;
    },
    [bikeController, getAllBikes, updateState],
  );

  const updateBike = useCallback(
    async (id: number, bike: ICreateBikeRequest) => {
      if (!bikeController) return;
      updateState({ loading: true, error: null });
      const { error, data: updatedBike } = await bikeController.updateBike({
        id,
        bikeData: bike,
      });
      if (error) {
        updateState({ loading: false, error: error });
        return null;
      }
      setState((prev) => ({
        ...prev,
        bikes: prev.bikes.map((bike) => (bike.id === id ? updatedBike : bike)),
        loading: false,
      }));
      return updatedBike;
    },
    [bikeController, updateState],
  );

  const deleteBike = useCallback(
    async (id: number) => {
      if (!bikeController) return;
      updateState({ loading: true, error: null });
      const { error } = await bikeController.deleteBike(id);
      if (error) {
        updateState({ loading: false, error: error });
        return;
      }
      setState((prev) => ({
        ...prev,
        bikes: prev.bikes.filter((bike) => bike.id !== id),
        loading: false,
      }));
    },
    [bikeController, updateState],
  );

  const refreshBikes = useCallback(async () => {
    await getAllBikes();
  }, [getAllBikes]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  useEffect(() => {
    if (db && bikeController) {
      getAllBikes();
    }
  }, [bikeController, db, getAllBikes]);

  return {
    ...state,
    createBike,
    updateBike,
    deleteBike,
    getAllBikes,
    getBikeById,
    refreshBikes,
    clearError,
  };
};
