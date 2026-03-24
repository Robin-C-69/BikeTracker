import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import { Divider } from "@/components/common/Divider";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import { Piece } from "@/database/models/PieceModel";
import { useTranslation } from "react-i18next";
import {
  calculateAndFormatAge,
  formatDateToHumanString,
  formatPieceTypeAndCategory,
} from "@/components/utils";
import { useMaintenanceHistoryStore } from "@/stores/historyStore";
import { MaintenanceHistoryService } from "@/database/services/MaintenanceHistoryService";
import { useDatabase } from "@/context/DatabaseContext";
import { usePieceCategory } from "@/hooks/usePieceCategory";
import { usePieceType } from "@/hooks/usePieceType";

export const PieceCard = ({ piece }: { piece: Piece }) => {
  const { t } = useTranslation();
  const { db } = useDatabase();
  const { historyByPiece, setHistoryForPiece } = useMaintenanceHistoryStore();
  const { pieceCategories, loading: pieceCategoryLoading } = usePieceCategory();
  const { pieceTypes, loading: pieceTypesLoading } = usePieceType();

  const currentPieceHistory = useMemo(() => {
    return historyByPiece[piece.id];
  }, [historyByPiece, piece.id]);

  const maintenanceHistoryService = useMemo(() => {
    if (!db) return null;
    return new MaintenanceHistoryService(db);
  }, [db]);

  const lastMaintenanceDate = () => {
    const lastHistory = currentPieceHistory?.[0] ?? null;
    if (lastHistory) {
      return formatDateToHumanString(lastHistory.date);
    }
    return "-";
  };

  const pieceInstalledDate = useCallback(() => {
    return formatDateToHumanString(piece.installDate);
  }, [piece.installDate]);

  const formatDays = useCallback(() => {
    return calculateAndFormatAge(piece.installDate, t);
  }, [piece.installDate, t]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!maintenanceHistoryService) return;
      const { data, error } = await maintenanceHistoryService.getHistoryByPiece(
        piece.id,
      );
      if (!error && data) {
        setHistoryForPiece(piece.id, data);
      }
    };
    loadHistory();
  }, [maintenanceHistoryService, piece.id, setHistoryForPiece]);

  return (
    <Box style={styles.card}>
      <Box style={styles.headerRow}>
        <Box>
          <Text style={styles.name}>{piece.name}</Text>
          {!pieceTypesLoading && !pieceCategoryLoading && (
            <Text style={styles.typeAndCategory}>
              {formatPieceTypeAndCategory(
                piece.categoryId,
                pieceCategories,
                pieceTypes,
                t,
              )}
            </Text>
          )}
          <Text style={styles.description}>{piece.description}</Text>
        </Box>
      </Box>
      <Divider />
      <Box style={styles.infos}>
        <Box style={styles.column}>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Installed date")}</Text>
            <Text style={styles.infoValue}>{pieceInstalledDate()}</Text>
          </Box>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Last Maintenance")}</Text>
            <Text style={styles.infoValue}>{lastMaintenanceDate()}</Text>
          </Box>
        </Box>
        <Box style={styles.column}>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Age")}</Text>
            <Text style={styles.infoValue}>{formatDays()}</Text>
          </Box>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Next action")}</Text>
            <Text style={styles.infoValue}>TODO</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#22272e",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#2d333a",
    padding: 12,
    borderRadius: 16,
    justifyContent: "space-between",
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing(0.25),
  },
  typeAndCategory: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.sm,
    marginBottom: theme.spacing(1),
  },
  description: {
    color: theme.colors.text.primary,
  },
  infos: { flexDirection: "row" },
  column: {
    flexDirection: "column",
    flex: 1,
    marginBottom: theme.spacing(1),
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  infoLabel: {
    color: theme.colors.text.tertiary,
    marginBottom: theme.spacing(0.5),
  },
  infoValue: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});
