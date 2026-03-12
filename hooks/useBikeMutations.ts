import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useMemo } from "react";
import { CreateBikeRequest } from "@/database/models/BikeModel";
import { BikeService } from "@/database/services/BikeService";
import { useBikeStore } from "@/stores/bikeStore";

export const useBikeMutations = () => {
  const { db } = useDatabase();
  const { addBike, updateBike: updateBikeInStore, removeBike } = useBikeStore();

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
      addBike(newBike);
      return newBike;
    },
    [addBike, bikeService],
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
      updateBikeInStore(id, updatedBike);
      return updatedBike;
    },
    [bikeService, updateBikeInStore],
  );

  const deleteBike = useCallback(
    async (id: number) => {
      if (!bikeService) return;
      const { error } = await bikeService.deleteBike(id);
      if (!error) removeBike(id);
    },
    [bikeService, removeBike],
  );

  return {
    createBike,
    updateBike,
    deleteBike,
  };
};
