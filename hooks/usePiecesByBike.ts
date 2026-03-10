import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo } from "react";
import { PieceService } from "@/database/services/PieceService";
import { usePieceStore } from "@/stores/pieceStore";

export const usePiecesByBike = (bikeId: number) => {
  const { db } = useDatabase();
  const { pieces, error, loading, setError, setLoading, setPieces } =
    usePieceStore();

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const getAllPiecesWithDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!pieceService) return;
    const { error, data } =
      await pieceService.getPiecesByBikeWithDetails(bikeId);
    if (error) {
      setError(error);
      setLoading(false);
      return [];
    }
    setPieces(data);
    setLoading(false);
    return data;
  }, [setLoading, setError, pieceService, bikeId, setPieces]);

  useEffect(() => {
    if (db && pieceService) {
      getAllPiecesWithDetails();
    }
  }, [db, pieceService, getAllPiecesWithDetails]);

  return {
    pieces: pieces.filter((piece) => piece.bikeId === bikeId),
    loading,
    error,
  };
};
