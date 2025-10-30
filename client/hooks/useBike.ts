import {
  IBike,
  ICreateBikeRequest,
  IUpdateBikeRequest,
} from "@/api/models/BikeModel";
import { useDatabase } from "@/client/context/DatabaseContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BikeService } from "@/api/services/BikeService";

interface UseBikeState {
  bikes: IBike[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

interface UseBikeActions {
  createBike: (
    bike: ICreateBikeRequest,
  ) => Promise<{ success: boolean; bike?: IBike; errors?: string[] }>;
  updateBike: (
    id: number,
    bikeData: Partial<IUpdateBikeRequest>,
  ) => Promise<{
    success: boolean;
    bike?: IBike;
    errors?: string[];
  }>;
  deleteBike: (id: number) => Promise<{ success: boolean; errors?: string[] }>;
  getAllBikes: (page?: number, limit?: number) => Promise<void>;
  getBikeById: (id: number) => Promise<IBike | null>;
  refreshBikes: () => Promise<void>;
  clearError: () => void;
}

export const useBike = (): UseBikeState & UseBikeActions => {
  const { db, isReady } = useDatabase();
  const [state, setState] = useState<UseBikeState>({
    bikes: [],
    loading: false,
    error: null,
    hasMore: false,
  });

  const bikeService = useMemo(() => {
    return db ? new BikeService(db) : null;
  }, [db]);

  const setLoading = (loading: boolean) => {
    setState((prevState) => ({ ...prevState, loading }));
  };

  const setError = (error: string | null) => {
    setState((prevState) => ({ ...prevState, error }));
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const createBike = useCallback(
    async (
      bike: ICreateBikeRequest,
    ): Promise<{
      success: boolean;
      bike?: IBike;
      errors?: string[];
    }> => {
      if (!bikeService)
        return { success: false, errors: ["Service not initialized"] };

      setLoading(true);
      setError(null);

      try {
        const { bike: newBike, errors } = await bikeService.createBike(bike);
        if (!errors && newBike) {
          setState((prevState) => ({
            ...prevState,
            bikes: [newBike!, ...prevState.bikes],
          }));
          return { success: true, bike: newBike };
        } else {
          setError("Failed to create bike.");
          return { success: false, errors };
        }
      } catch {
        setError("Failed to create bike.");
        return { success: false, errors: ["Failed to create bike."] };
      } finally {
        setLoading(false);
      }
    },
    [bikeService],
  );

  const updateBike = useCallback(
    async (
      id: number,
      bikeData: Partial<IUpdateBikeRequest>,
    ): Promise<{
      success: boolean;
      bike?: IBike;
      errors?: string[];
    }> => {
      if (!bikeService)
        return { success: false, errors: ["Service not initialized"] };

      setLoading(true);
      setError(null);

      try {
        const { bike, errors } = await bikeService.updateBike(id, bikeData);
        if (!errors && bike) {
          setState((prevState) => ({
            ...prevState,
            bikes: prevState.bikes.map((b) => (b.id === id ? bike : b)),
          }));
          return { success: true, bike };
        } else {
          setError("Failed to update bike.");
          return { success: false, errors };
        }
      } catch {
        setError("Failed to update bike.");
        return { success: false, errors: ["Failed to update bike."] };
      } finally {
        setLoading(false);
      }
    },
    [bikeService],
  );

  const deleteBike = useCallback(
    async (id: number): Promise<{ success: boolean; errors?: string[] }> => {
      if (!bikeService)
        return { success: false, errors: ["Service not initialized"] };

      setLoading(true);
      setError(null);

      try {
        const result = await bikeService.deleteBike(id);
        if (result) {
          setState((prevState) => ({
            ...prevState,
            bikes: prevState.bikes.filter((bike) => bike.id !== id),
          }));
          return { success: true };
        } else {
          setError("Failed to delete bike.");
          return { success: false, errors: ["Failed to delete bike."] };
        }
      } catch {
        setError("Failed to delete bike.");
        return { success: false, errors: ["Failed to delete bike."] };
      } finally {
        setLoading(false);
      }
    },
    [bikeService],
  );

  const getAllBikes = useCallback(
    async (page: number = 1, limit: number = 10) => {
      if (!bikeService) return;

      setLoading(true);
      setError(null);

      try {
        const result = await bikeService.getAllBikes(page, limit);
        setState((prevState) => ({
          ...prevState,
          bikes:
            page === 1 ? result.bikes : [...prevState.bikes, ...result.bikes],
          hasMore: result.hasMore,
        }));
      } catch {
        setError("Failed to fetch bikes.");
      } finally {
        setLoading(false);
      }
    },
    [bikeService],
  );

  const getBikeById = useCallback(
    async (id: number): Promise<IBike | null> => {
      if (!bikeService) return null;

      setLoading(true);
      setError(null);

      try {
        return await bikeService.getBikeById(id);
      } catch {
        setError("Failed to fetch bike.");
        return null;
      }
    },
    [bikeService],
  );

  const refreshBikes = useCallback(async () => {
    await getAllBikes(1);
  }, [getAllBikes]);

  useEffect(() => {
    if (isReady && bikeService && state.bikes.length === 0) {
      getAllBikes();
    }
  }, [isReady, bikeService, state.bikes.length, getAllBikes]);

  return {
    // State
    bikes: state.bikes,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    // Actions
    createBike,
    updateBike,
    deleteBike,
    getAllBikes,
    getBikeById,
    refreshBikes,
    clearError,
  };
};
