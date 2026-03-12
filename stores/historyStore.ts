import { create } from "zustand";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";

interface MaintenanceHistoryStore {
  // keyed by pieceId for easy lookup
  historyByPiece: Record<number, MaintenanceHistoryWithType[]>;
  addHistoryEntry: (pieceId: number, entry: MaintenanceHistoryWithType) => void;
  setHistoryForPiece: (
    pieceId: number,
    entries: MaintenanceHistoryWithType[],
  ) => void;
  removeOneHistoryEntryForAPiece: (pieceId: number, entryId: number) => void;
  removeAllHistoryEntriesForAPiece: (pieceId: number) => void;
}

export const useMaintenanceHistoryStore = create<MaintenanceHistoryStore>(
  (set) => ({
    historyByPiece: {},
    setHistoryForPiece: (pieceId, entries) =>
      set((state) => ({
        historyByPiece: { ...state.historyByPiece, [pieceId]: entries },
      })),
    addHistoryEntry: (pieceId, entry) =>
      set((state) => ({
        historyByPiece: {
          ...state.historyByPiece,
          [pieceId]: [entry, ...(state.historyByPiece[pieceId] ?? [])],
        },
      })),
    removeOneHistoryEntryForAPiece: (pieceId, entryId) =>
      set((state) => ({
        historyByPiece: {
          ...state.historyByPiece,
          [pieceId]: (state.historyByPiece[pieceId] ?? []).filter(
            (e) => e.id !== entryId,
          ),
        },
      })),
    removeAllHistoryEntriesForAPiece: (pieceId: number) =>
      set((state) => {
        const { [pieceId]: _, ...rest } = state.historyByPiece;
        return { historyByPiece: rest };
      }),
  }),
);
