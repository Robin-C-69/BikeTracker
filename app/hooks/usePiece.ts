import { ICreatePieceRequest, IPiece } from "@/api/models/PieceModel";
import { useDatabase } from "@/app/context/DatabaseContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PieceService } from "@/api/services/PieceService";
import { PieceController } from "@/api/controllers/PieceController";

interface UsePieceState {
  pieces: IPiece[];
  loading: boolean;
  error: string | null;
}

interface UsePieceActions {
  createPiece: (piece: ICreatePieceRequest) => Promise<IPiece>;
  updatePiece: (id: number, piece: ICreatePieceRequest) => Promise<IPiece>;
  deletePiece: (id: number) => Promise<void>;
  getAllPieces: (page?: number, limit?: number) => Promise<IPiece[]>;
  getPieceById: (id: number) => Promise<IPiece | null>;
  getPieceByBikeId: (bikeId: number) => Promise<IPiece[]>;
  refreshPieces: () => Promise<void>;
  clearError: () => void;
}

export const usePiece = (): UsePieceState & UsePieceActions => {
  const { db } = useDatabase();
  const [state, setState] = useState<UsePieceState>({
    pieces: [],
    loading: false,
    error: null,
  });

  const pieceController = useMemo(() => {
    if (!db) return null;
    const pieceService = new PieceService(db);
    return new PieceController(pieceService);
  }, [db]);

  const updateState = useCallback((updates: Partial<UsePieceState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const getAllPieces = useCallback(
    async (page?: number, limit?: number) => {
      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error, data } = await pieceController.getAllPieces({
        page,
        limit,
      });
      if (error) {
        updateState({ loading: false, error: error });
        return [];
      }
      updateState({ pieces: data, loading: false });
      return data;
    },
    [pieceController, updateState],
  );

  const getPieceById = useCallback(
    async (id: number) => {
      const cachedPiece = state.pieces.find((piece) => piece.id === id);
      if (cachedPiece) return cachedPiece;

      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error, data } = await pieceController.getPieceById(id);

      if (error) return null;
      setState((prev) => ({
        ...prev,
        loading: false,
        pieces: [...prev.pieces, data!],
      }));
      return data;
    },
    [pieceController, state.pieces, updateState],
  );

  const getPieceByBikeId = useCallback(
    async (bikeId: number) => {
      const cachedPieces = state.pieces.filter(
        (piece) => piece.bikeId === bikeId,
      );
      if (cachedPieces.length) return cachedPieces;

      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error, data } = await pieceController.getPiecesByBikeId(bikeId);

      if (error) return null;

      setState((prev) => ({
        ...prev,
        loading: false,
        pieces: [...prev.pieces, ...data],
      }));
      return data;
    },
    [pieceController, state.pieces, updateState],
  );

  const createPiece = useCallback(
    async (piece: ICreatePieceRequest) => {
      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error, data: newPiece } =
        await pieceController.createPiece(piece);
      if (error) {
        updateState({ loading: false, error: error });
        return null;
      }
      await getAllPieces();
      updateState({ loading: false });
      return newPiece;
    },
    [getAllPieces, pieceController, updateState],
  );

  const updatePiece = useCallback(
    async (id: number, piece: ICreatePieceRequest) => {
      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error, data: updatedPiece } = await pieceController.updatePiece({
        id,
        pieceData: piece,
      });
      if (error) {
        updateState({ loading: false, error: error });
        return null;
      }
      setState((prev) => ({
        ...prev,
        pieces: prev.pieces.map((piece) =>
          piece.id === id ? updatedPiece! : piece,
        ),
        loading: false,
      }));
      return updatedPiece;
    },
    [pieceController, updateState],
  );

  const deletePiece = useCallback(
    async (id: number) => {
      if (!pieceController) return;
      updateState({ loading: true, error: null });
      const { error } = await pieceController.deletePiece(id);
      if (error) {
        updateState({ loading: false, error: error });
        return;
      }
      setState((prev) => ({
        ...prev,
        pieces: prev.pieces.filter((piece) => piece.id !== id),
        loading: false,
      }));
    },
    [pieceController, updateState],
  );

  const refreshPieces = useCallback(async () => {
    await getAllPieces();
  }, [getAllPieces]);

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  useEffect(() => {
    if (db && pieceController) {
      getAllPieces();
    }
  }, [db, getAllPieces, pieceController]);

  return {
    ...state,
    createPiece,
    updatePiece,
    deletePiece,
    getAllPieces,
    getPieceById,
    getPieceByBikeId,
    refreshPieces,
    clearError,
  };
};
