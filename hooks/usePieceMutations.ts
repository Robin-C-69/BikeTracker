import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useMemo } from "react";
import { PieceService } from "@/database/services/PieceService";
import { CreatePiece } from "@/database/models/PieceModel";

export const usePieceMutations = () => {
  const { db } = useDatabase();

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const createPiece = useCallback(
    async (piece: CreatePiece) => {
      if (!pieceService) return;
      const { error, data: newPiece } = await pieceService.createPiece(piece);
      if (error) {
        return null;
      }
      return newPiece;
    },
    [pieceService],
  );

  const updatePiece = useCallback(
    async (id: number, piece: CreatePiece) => {
      if (!pieceService) return;
      const { error, data: updatedPiece } = await pieceService.updatePiece({
        id,
        data: piece,
      });
      if (error) {
        return null;
      }
      return updatedPiece;
    },
    [pieceService],
  );

  const deletePiece = useCallback(
    async (id: number) => {
      if (!pieceService) return;
      const { error } = await pieceService.deletePiece(id);
      if (error) {
        return;
      }
    },
    [pieceService],
  );

  return {
    createPiece,
    updatePiece,
    deletePiece,
  };
};
