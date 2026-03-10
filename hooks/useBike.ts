import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo } from "react";
import { BikeService } from "@/database/services/BikeService";
import { useBikeStore } from "@/stores/bikeStore";

export const useBike = () => {
  const { db } = useDatabase();
  const { bikes, loading, error, addBike, setBikes, setError, setLoading } =
    useBikeStore();

  const bikeService = useMemo(() => {
    if (!db) return null;
    return new BikeService(db);
  }, [db]);

  const getAllBikes = useCallback(
    async (page?: number, limit?: number) => {
      if (!bikeService) return;
      setLoading(true);
      setError(null);
      const { error, data } = await bikeService.getAllBikes({ page, limit });
      if (error) {
        setError(error);
        setLoading(false);
        return [];
      }
      setBikes(data);
      setLoading(false);
      return data;
    },
    [bikeService, setBikes, setError, setLoading],
  );

  const getBikeById = useCallback(
    async (id: number) => {
      const cachedBike = bikes.find((bike) => bike.id === id);
      if (cachedBike) return cachedBike;

      if (!bikeService) return;
      setLoading(true);
      setError(null);
      const { error, data } = await bikeService.getBikeById(id);
      setLoading(false);
      if (error) return null;
      addBike(data);
      return data;
    },
    [addBike, bikeService, bikes, setError, setLoading],
  );

  useEffect(() => {
    if (db && bikeService) {
      getAllBikes();
    }
  }, [bikeService, db, getAllBikes]);

  return {
    bikes,
    loading,
    error,
    getAllBikes,
    getBikeById,
  };
};
