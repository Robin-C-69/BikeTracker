import { PieceType } from "@/database/models/PieceTypeModel";
import { create } from "zustand/react";

interface PieceTypeStore {
  pieceTypes: PieceType[];
  loading: boolean;
  error: string | null;
  setPieceTypes: (pieceTypes: PieceType[]) => void;
  addPieceType: (pieceType: PieceType) => void;
  removePieceType: (id: number) => void;
  updatePieceType: (id: number, pieceType: PieceType) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePieceTypeStore = create<PieceTypeStore>((set) => ({
  pieceTypes: [],
  loading: false,
  error: null,
  setPieceTypes: (pieceTypes) => set({ pieceTypes }),
  addPieceType: (pieceType) =>
    set((prev) => ({ pieceTypes: [...prev.pieceTypes, pieceType] })),
  removePieceType: (id) =>
    set((prev) => ({
      pieceTypes: prev.pieceTypes.filter((pieceType) => pieceType.id !== id),
    })),
  updatePieceType: (id, pieceType) =>
    set((state) => ({
      pieceTypes: state.pieceTypes.map((b) => (b.id === id ? pieceType : b)),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
