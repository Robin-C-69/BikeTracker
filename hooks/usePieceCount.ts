import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo } from "react";
import { PieceService } from "@/database/services/PieceService";
import { usePieceStore } from "@/stores/pieceStore";

export const usePieceCount = (bikeId: number) => {
  const { db } = useDatabase();
  const count = usePieceStore((s) => s.count[bikeId] ?? 0);
  const setPieceCount = usePieceStore((s) => s.setCount);

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const fetchCount = useCallback(async () => {
    if (!pieceService) return;
    const { error, data } = await pieceService.getPieceCountByBike(bikeId);
    if (!error) setPieceCount(bikeId, data as number);
  }, [pieceService, bikeId, setPieceCount]);

  useEffect(() => {
    if (db && pieceService) fetchCount();
  }, [db, pieceService, fetchCount]);

  return count;
};
