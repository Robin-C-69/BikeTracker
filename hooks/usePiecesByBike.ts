import { useDatabase } from "@/context/DatabaseContext";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieceService } from "@/database/services/PieceService";

interface UsePiecesByBikeState {
  pieces: PieceWithDetails[];
  loading: boolean;
  error: string | null;
}

interface Actions {
  refreshPieces: () => Promise<void>;
}

export const usePiecesByBike = (
  bikeId: number,
): UsePiecesByBikeState & Actions => {
  const { db } = useDatabase();
  const [pieces, setPieces] = useState<UsePiecesByBikeState>({
    pieces: [],
    loading: false,
    error: null,
  });

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const updateState = useCallback((updates: Partial<UsePiecesByBikeState>) => {
    setPieces((prev) => ({ ...prev, ...updates }));
  }, []);

  const getAllPiecesWithDetails = useCallback(async () => {
    updateState({ loading: true, error: null, pieces: [] });
    if (!pieceService) return;
    const { error, data } =
      await pieceService.getPiecesByBikeWithDetails(bikeId);
    if (error) {
      updateState({ loading: false, error: error });
      return [];
    }
    updateState({ pieces: data, loading: false });
    return data;
  }, [pieceService, updateState, bikeId]);

  const refreshPieces = useCallback(async () => {
    await getAllPiecesWithDetails();
  }, [getAllPiecesWithDetails]);

  useEffect(() => {
    if (db && pieceService) {
      getAllPiecesWithDetails();
    }
  }, [db, pieceService, getAllPiecesWithDetails]);

  return {
    ...pieces,
    refreshPieces,
  };
};
