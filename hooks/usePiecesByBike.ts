import { useDatabase } from "@/app/context/DatabaseContext";
import { Piece } from "@/database/models/PieceModel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieceService } from "@/database/services/PieceService";

interface UsePiecesByBikeState {
  pieces: Piece[];
  loading: boolean;
  error: string | null;
  refetch?: () => Promise<Piece[]>;
}

export const usePiecesByBike = (bikeId: number): UsePiecesByBikeState => {
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

  const getPieces = useCallback(async () => {
    updateState({ loading: true, error: null });
    if (!pieceService) return;
    const { error, data } = await pieceService.getPiecesByBike(bikeId);
    if (error) {
      updateState({ loading: false, error: error });
      return [];
    }
    updateState({ pieces: data, loading: false });
    return data;
  }, [pieceService, updateState, bikeId]);

  useEffect(() => {
    if (db && pieceService) {
      getPieces();
    }
  }, [db, pieceService, getPieces]);

  return {
    ...pieces,
    refetch: getPieces,
  };
};
