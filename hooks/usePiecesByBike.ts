import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo } from "react";
import { PieceService } from "@/database/services/PieceService";
import { usePieceStore } from "@/stores/pieceStore";
import { useShallow } from "zustand/react/shallow";

export const usePiecesByBike = (bikeId: number) => {
  const { db } = useDatabase();

  const pieces = usePieceStore(useShallow((p) => p.pieces[bikeId] ?? []));
  const loading = usePieceStore((p) => p.loading[bikeId] ?? false);
  const error = usePieceStore((p) => p.error[bikeId] ?? null);
  const setPieces = usePieceStore((p) => p.setPieces);
  const setLoading = usePieceStore((p) => p.setLoading);
  const setError = usePieceStore((p) => p.setError);

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const getAllPiecesWithDetails = useCallback(async () => {
    setLoading(bikeId, true);
    setError(bikeId, null);
    if (!pieceService) return;
    const { error, data } =
      await pieceService.getPiecesByBikeWithDetails(bikeId);
    if (error) {
      setError(bikeId, error);
      setLoading(bikeId, false);
      return [];
    }
    setPieces(bikeId, data);
    setLoading(bikeId, false);
    return data;
  }, [setLoading, setError, pieceService, bikeId, setPieces]);

  useEffect(() => {
    if (db && pieceService) {
      getAllPiecesWithDetails();
    }
  }, [db, pieceService, getAllPiecesWithDetails]);

  return {
    pieces,
    loading,
    error,
    refetch: getAllPiecesWithDetails,
  };
};
