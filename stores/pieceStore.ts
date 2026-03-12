import { create } from "zustand";
import { PieceWithDetails } from "@/database/models/PieceModel";

interface PieceStore {
  pieces: PieceWithDetails[];
  loading: boolean;
  error: string | null;
  setPieces: (pieces: PieceWithDetails[]) => void;
  addPiece: (piece: PieceWithDetails) => void;
  removePiece: (id: number) => void;
  updatePiece: (id: number, piece: PieceWithDetails) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePieceStore = create<PieceStore>((set) => ({
  pieces: [],
  loading: false,
  error: null,
  setPieces: (pieces) => set({ pieces }),
  addPiece: (piece) => set((prev) => ({ pieces: [piece, ...prev.pieces] })),
  removePiece: (id) =>
    set((prev) => ({ pieces: prev.pieces.filter((p) => p.id !== id) })),
  updatePiece: (id, piece) =>
    set((prev) => ({
      pieces: prev.pieces.map((p) => (p.id === id ? piece : p)),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
