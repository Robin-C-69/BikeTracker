import { create } from "zustand/react";
import { Category } from "@/database/models/PieceCategoryModel";

interface PieceCategoryStore {
  pieceCategories: Category[];
  loading: boolean;
  error: string | null;
  setPieceCategories: (pieceCategories: Category[]) => void;
  addPieceCategory: (pieceCategory: Category) => void;
  removePieceCategory: (id: number) => void;
  updatePieceCategory: (id: number, pieceCategory: Category) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePieceCategoryStore = create<PieceCategoryStore>((set) => ({
  pieceCategories: [],
  loading: false,
  error: null,
  setPieceCategories: (pieceCategories) => set({ pieceCategories }),
  addPieceCategory: (pieceCategory) =>
    set((prev) => ({
      pieceCategories: [...prev.pieceCategories, pieceCategory],
    })),
  removePieceCategory: (id) =>
    set((prev) => ({
      pieceCategories: prev.pieceCategories.filter(
        (category) => category.id !== id,
      ),
    })),
  updatePieceCategory: (id, pieceCategory) =>
    set((state) => ({
      pieceCategories: state.pieceCategories.map((c) =>
        c.id === id ? pieceCategory : c,
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
