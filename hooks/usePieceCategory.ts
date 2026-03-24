import { useDatabase } from "@/context/DatabaseContext";
import { usePieceCategoryStore } from "@/stores/pieceCategoryStore";
import { useCallback, useEffect, useMemo } from "react";
import { PieceCategoryService } from "@/database/services/PieceCategoryService";

export const usePieceCategory = () => {
  const { db } = useDatabase();
  const {
    pieceCategories,
    loading,
    error,
    addPieceCategory,
    setPieceCategories,
    setLoading,
    setError,
  } = usePieceCategoryStore();

  const pieceCategoryService = useMemo(() => {
    if (!db) return null;
    return new PieceCategoryService(db);
  }, [db]);

  const getAllPieceCategories = useCallback(
    async (page?: number, limit?: number) => {
      if (!pieceCategoryService) return;
      setLoading(true);
      setError(null);
      const { error, data } = await pieceCategoryService.getAllPieceCategories({
        page,
        limit,
      });
      if (error) {
        setError(error);
        setLoading(false);
        return [];
      }
      setPieceCategories(data);
      setLoading(false);
      return data;
    },
    [pieceCategoryService, setError, setLoading, setPieceCategories],
  );

  const getPieceCategoryById = useCallback(
    async (id: number) => {
      const cachedPieceCategory = pieceCategories.find(
        (category) => category.id === id,
      );
      if (cachedPieceCategory) return cachedPieceCategory;

      if (!pieceCategoryService) return;
      setLoading(true);
      setError(null);
      const { error, data } =
        await pieceCategoryService.getPieceCategoryById(id);
      setLoading(false);
      if (error) return null;
      addPieceCategory(data);
      return data;
    },
    [
      addPieceCategory,
      pieceCategories,
      pieceCategoryService,
      setError,
      setLoading,
    ],
  );

  useEffect(() => {
    if (db && pieceCategoryService) {
      getAllPieceCategories();
    }
  }, [db, getAllPieceCategories, pieceCategoryService]);

  return {
    pieceCategories,
    loading,
    error,
    getAllPieceCategories,
    getPieceCategoryById,
  };
};
