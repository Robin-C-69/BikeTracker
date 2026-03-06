import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useMemo } from "react";
import { CreateBikeRequest } from "@/database/models/BikeModel";
import { BikeService } from "@/database/services/BikeService";

export const useBikeMutations = () => {
  const { db } = useDatabase();

  const bikeService = useMemo(() => {
    if (!db) return null;
    return new BikeService(db);
  }, [db]);

  const createBike = useCallback(
    async (bike: CreateBikeRequest) => {
      if (!bikeService) return;
      const { error, data: newBike } = await bikeService.createBike(bike);
      if (error) {
        return null;
      }
      return newBike;
    },
    [bikeService],
  );

  const updateBike = useCallback(
    async (id: number, bike: CreateBikeRequest) => {
      if (!bikeService) return;
      const { error, data: updatedBike } = await bikeService.updateBike({
        id,
        bike,
      });
      if (error) {
        return null;
      }
      return updatedBike;
    },
    [bikeService],
  );

  const deleteBike = useCallback(
    async (id: number) => {
      if (!bikeService) return;
      const { error } = await bikeService.deleteBike(id);
      if (error) {
        return;
      }
    },
    [bikeService],
  );

  return {
    createBike,
    updateBike,
    deleteBike,
  };
};
