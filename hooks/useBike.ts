import { Bike } from "@/database/models/BikeModel";
import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BikeService } from "@/database/services/BikeService";

interface UseBikeState {
  bikes: Bike[];
  loading: boolean;
  error: string | null;
}

interface UseBikeActions {
  getAllBikes: (page?: number, limit?: number) => Promise<Bike[]>;
  getBikeById: (id: number) => Promise<Bike | null>;
  refreshBikes: () => Promise<void>;
}

export const useBike = (): UseBikeState & UseBikeActions => {
  const { db } = useDatabase();
  const [state, setState] = useState<UseBikeState>({
    bikes: [],
    loading: false,
    error: null,
  });

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

  const refreshBikes = useCallback(async () => {
    await getAllBikes();
  }, [getAllBikes]);

  useEffect(() => {
    if (db && bikeService) {
      getAllBikes();
    }
  }, [bikeService, db, getAllBikes]);

  return {
    ...state,
    getAllBikes,
    getBikeById,
    refreshBikes,
  };
};
