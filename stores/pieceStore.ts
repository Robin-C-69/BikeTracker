import { create } from "zustand";
import { PieceWithDetails } from "@/database/models/PieceModel";

interface PieceStore {
  pieces: Record<number, PieceWithDetails[]>;
  count: Record<number, number>;
  loading: Record<number, boolean>;
  error: Record<number, string | null>;

  setPieces: (bikeId: number, pieces: PieceWithDetails[]) => void;
  addPiece: (bikeId: number, piece: PieceWithDetails) => void;
  removePiece: (bikeId: number, id: number) => void;
  updatePiece: (bikeId: number, id: number, piece: PieceWithDetails) => void;
  setCount: (bikeId: number, count: number) => void;
  setLoading: (bikeId: number, loading: boolean) => void;
  setError: (bikeId: number, error: string | null) => void;
}

export const usePieceStore = create<PieceStore>((set) => ({
  pieces: {},
  count: {},
  loading: {},
  error: {},

  setPieces: (bikeId, pieces) =>
    set((prev) => ({
      pieces: {
        ...prev,
        [bikeId]: pieces,
      },
    })),
  addPiece: (bikeId, piece) =>
    set((prev) => {
      const updatedPieces = [piece, ...(prev.pieces[bikeId] ?? [])];
      return {
        pieces: { ...prev.pieces, [bikeId]: updatedPieces },
        count: { ...prev.count, [bikeId]: updatedPieces.length },
      };
    }),
  removePiece: (bikeId, id) =>
    set((prev) => {
      const updatedPieces = (prev.pieces[bikeId] ?? []).filter(
        (p) => p.id !== id,
      );
      return {
        pieces: { ...prev.pieces, [bikeId]: updatedPieces },
        count: { ...prev.count, [bikeId]: updatedPieces.length },
      };
    }),
  updatePiece: (bikeId, id, piece) =>
    set((prev) => ({
      pieces: {
        ...prev.pieces,
        [bikeId]: (prev.pieces[bikeId] ?? []).map((p) =>
          p.id === id ? piece : p,
        ),
      },
    })),
  setCount: (bikeId, count) =>
    set((prev) => ({
      count: {
        ...prev.count,
        [bikeId]: count,
      },
    })),
  setLoading: (bikeId, loading) =>
    set((prev) => ({
      loading: { ...prev.loading, [bikeId]: loading },
    })),

  setError: (bikeId, error) =>
    set((prev) => ({
      error: { ...prev.error, [bikeId]: error },
    })),
}));
