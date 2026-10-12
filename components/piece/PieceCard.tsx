import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import { Piece } from "@/database/models/PieceModel";
import { useTranslation } from "react-i18next";
import {
  capitalized,
  formatDateToHumanString,
} from "@/components/utils/stringFormatting";
import { useMaintenanceHistoryStore } from "@/stores/historyStore";
import { MaintenanceHistoryService } from "@/database/services/MaintenanceHistoryService";
import { useDatabase } from "@/context/DatabaseContext";
import { usePieceCategory } from "@/hooks/usePieceCategory";
import { getCategoryNameById } from "@/components/utils/typesCategoriesFunctions";

export const PieceCard = ({ piece }: { piece: Piece }) => {
  const { t } = useTranslation();
  const { db } = useDatabase();
  const { historyByPiece, setHistoryForPiece } = useMaintenanceHistoryStore();
  const { pieceCategories } = usePieceCategory();

  const currentPieceHistory = useMemo(() => {
    return historyByPiece[piece.id];
  }, [historyByPiece, piece.id]);

  const maintenanceHistoryService = useMemo(() => {
    if (!db) return null;
    return new MaintenanceHistoryService(db);
  }, [db]);

  // const nextAction = useMemo(() => {
  //   if (!currentPieceHistory) return null;
  //   return nextMaintenanceAction(currentPieceHistory, piece);
  // }, [currentPieceHistory, piece]);

  const categoryName = useMemo(() => {
    return getCategoryNameById(piece.categoryId, pieceCategories);
  }, [piece.categoryId, pieceCategories]);

  // const nextActionName = nextAction?.maintenanceName
  //   ? `maintenance_type.${nextAction?.maintenanceName}`
  //   : "-";

  const lastMaintenanceDate = () => {
    const lastHistory = currentPieceHistory?.[0] ?? null;
    if (lastHistory) {
      return formatDateToHumanString(lastHistory.date);
    }
    return "-";
  };

  const pieceInstalledDate = useCallback(() => {
    return formatDateToHumanString(piece.installDate) ?? "-";
  }, [piece.installDate]);

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
      <Box style={styles.leftRow}>
        <Box>
          <Text style={styles.name}>{piece.name}</Text>
          <Text style={styles.category}>
            {t(`categories.${capitalized(categoryName)}`)}
          </Text>
          <Text style={styles.description}>{piece.description}</Text>
        </Box>
      </Box>
      <Box style={styles.rightRow}>
        {/*<Box style={[styles.stateBox, styles.statusGood]}>*/}
        {/*  <Text>{t(nextActionName)}</Text>*/}
        {/*</Box>*/}
        <View style={styles.infos}>
          <Text style={styles.infoLabel}>{t("Installed")}:</Text>
          <Text style={styles.infoValue}>{pieceInstalledDate()}</Text>
        </View>
        <View style={styles.infos}>
          <Text style={styles.infoLabel}>{t("Last Maintenance")}:</Text>
          <Text style={styles.infoValue}>{lastMaintenanceDate()}</Text>
        </View>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border.default,
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(0.5),
    justifyContent: "space-between",
    marginVertical: theme.spacing(1),
  },
  leftRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: theme.spacing(1),
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  category: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing(0.5),
  },
  description: {
    color: theme.colors.text.primary,
  },
  stateBox: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  // statusGood: {
  //   backgroundColor: theme.colors.surfaceVariant,
  //   borderColor: theme.colors.border.lighting,
  //   borderWidth: 1,
  //   color: theme.colors.text.lighting,
  // },
  rightRow: {
    flexDirection: "column",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  infos: {
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.xs,
  },
  infoValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
  },
});
