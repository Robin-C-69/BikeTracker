import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useMemo } from "react";
import { PieceService } from "@/database/services/PieceService";
import { CreatePiece } from "@/database/models/PieceModel";
import { usePieceStore } from "@/stores/pieceStore";

export const usePieceMutations = () => {
  const { db } = useDatabase();
  const {
    addPiece,
    updatePiece: updatePieceInStore,
    removePiece,
  } = usePieceStore();

  const pieceService = useMemo(() => {
    if (!db) return null;
    return new PieceService(db);
  }, [db]);

  const createPiece = useCallback(
    async (piece: CreatePiece) => {
      if (!pieceService) return;
      const { error, data: newPiece } = await pieceService.createPiece(piece);
      if (error || !newPiece) {
        return null;
      }
      const { data: newPieceWithDetails } =
        await pieceService.getPieceWithDetails(newPiece.id);
      if (newPieceWithDetails) addPiece(newPieceWithDetails);
      return newPieceWithDetails;
    },
    [addPiece, pieceService],
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
      updatePieceInStore(id, updatedPiece);
      return updatedPiece;
    },
    [pieceService, updatePieceInStore],
  );

  const deletePiece = useCallback(
    async (id: number) => {
      if (!pieceService) return;
      const { error } = await pieceService.deletePiece(id);
      if (!error) removePiece(id);
    },
    [pieceService, removePiece],
  );

  return {
    createPiece,
    updatePiece,
    deletePiece,
  };
};
