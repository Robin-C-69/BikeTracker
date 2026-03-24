import { useDatabase } from "@/context/DatabaseContext";
import { useCallback, useEffect, useMemo } from "react";
import { PieceTypeService } from "@/database/services/PieceTypeService";
import { usePieceTypeStore } from "@/stores/pieceTypeStore";

export const usePieceType = () => {
  const { db } = useDatabase();
  const {
    pieceTypes,
    error,
    loading,
    addPieceType,
    setError,
    setLoading,
    setPieceTypes,
  } = usePieceTypeStore();

  const pieceTypeService = useMemo(() => {
    if (!db) return null;
    return new PieceTypeService(db);
  }, [db]);

  const getAllPieceTypes = useCallback(
    async (page?: number, limit?: number) => {
      if (!pieceTypeService) return;
      setLoading(true);
      setError(null);
      const { error, data } = await pieceTypeService.getAllPieceTypes({
        page,
        limit,
      });
      setLoading(false);
      if (error) {
        setError(error);
        return [];
      }
      setPieceTypes(data);
      return data;
    },
    [pieceTypeService, setError, setLoading, setPieceTypes],
  );

  const getPieceTypeById = useCallback(
    async (id: number) => {
      const cachedPieceType = pieceTypes.find((type) => type.id === id);
      if (cachedPieceType) return cachedPieceType;

      if (!pieceTypeService) return;
      setLoading(true);
      setError(null);
      const { error, data } = await pieceTypeService.getPieceTypeById(id);
      setLoading(false);
      if (error) {
        setError(error);
        return [];
      }
      addPieceType(data);
      return data;
    },
    [addPieceType, pieceTypeService, pieceTypes, setError, setLoading],
  );

  useEffect(() => {
    if (db && pieceTypeService) {
      getAllPieceTypes();
    }
  }, [db, getAllPieceTypes, pieceTypeService]);

  return {
    pieceTypes,
    loading,
    error,
    getAllPieceTypes,
    getPieceTypeById,
  };
};
