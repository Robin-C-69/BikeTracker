import { Bike, CreateBikeRequest } from "@/database/models/BikeModel";
import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BikeService } from "@/database/services/BikeService";

interface UseBikeState {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
}

interface UseBikeActions {
  createBike: (bike: CreateBikeRequest) => Promise<Bike>;
  updateBike: (id: number, bike: CreateBikeRequest) => Promise<Bike>;
  deleteBike: (id: number) => Promise<void>;
  getAllBikes: (page?: number, limit?: number) => Promise<Bike[]>;
  getBikeById: (id: number) => Promise<Bike | null>;
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

  // console.log("Bike state:", state.bikes);

  const bikeService = useMemo(() => {
    if (!db) return null;
    return new BikeService(db);
  }, [db]);

  const updateState = useCallback((updates: Partial<UseBikeState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const getAllBikes = useCallback(
    async (page?: number, limit?: number) => {
      if (!bikeService) return;
      updateState({ loading: true, error: null });
      const { error, data } = await bikeService.getAllBikes({ page, limit });
      console.log("getAllBikes:", data);
      if (error) {
        updateState({ loading: false, error: error });
        return [];
      }
      updateState({ bikes: data, loading: false });
      return data;
    },
    [bikeService, updateState],
  );

  const getBikeById = useCallback(
    async (id: number) => {
      const cachedBike = state.bikes.find((bike) => bike.id === id);
      if (cachedBike) return cachedBike;

      if (!bikeService) return;
      updateState({ loading: true, error: null });
      const { error, data } = await bikeService.getBikeById(id);

      if (error) return null;

      setState((prev) => ({
        ...prev,
        loading: false,
        bikes: [...prev.bikes, data],
      }));
      return data;
    },
    [bikeService, state.bikes, updateState],
  );

  const createBike = useCallback(
    async (bike: CreateBikeRequest) => {
      if (!bikeService) return;
      updateState({ loading: true, error: null });
      // console.log("Create bike data", bike);
      const { error, data: newBike } = await bikeService.createBike(bike);
      if (error) {
        updateState({ loading: false, error: error });
        return null;
      }
      await getAllBikes();
      updateState({ loading: false });
      return newBike;
    },
    [bikeService, getAllBikes, updateState],
  );

  const updateBike = useCallback(
    async (id: number, bike: CreateBikeRequest) => {
      if (!bikeService) return;
      updateState({ loading: true, error: null });
      const { error, data: updatedBike } = await bikeService.updateBike({
        id,
        bike,
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
    [bikeService, updateState],
  );

  const deleteBike = useCallback(
    async (id: number) => {
      if (!bikeService) return;
      updateState({ loading: true, error: null });
      const { error } = await bikeService.deleteBike(id);
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
    [bikeService, updateState],
  );

  const refreshBikes = useCallback(async () => {
    await getAllBikes();
  }, [getAllBikes]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  useEffect(() => {
    if (db && bikeService) {
      getAllBikes();
    }
  }, [bikeService, db, getAllBikes]);

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
