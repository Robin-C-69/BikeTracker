import React, { useCallback } from "react";
import { StyleSheet, Text } from "react-native";
import { Divider } from "@/components/common/Divider";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import { Piece } from "@/database/models/PieceModel";
import { useTranslation } from "react-i18next";
import { initialCategories, initialTypes } from "@/database/seeds/initialData";
import {
  calculateAndFormatAge,
  capitalized,
  formatDateToHumanString,
} from "@/components/utils";

export const PieceCard = ({ piece }: { piece: Piece }) => {
  const { t } = useTranslation();

  const pieceInstalledDate = useCallback(() => {
    return formatDateToHumanString(piece.installDate);
  }, [piece.installDate]);

  const formatDays = useCallback(() => {
    return calculateAndFormatAge(piece.installDate, t);
  }, [piece.installDate, t]);

  const formatTypeAndCategory = useCallback(() => {
    // Todo: get infos from the db instead of the initialData
    const pieceCategory = initialCategories[piece.categoryId - 1];
    const categoryName = pieceCategory.name;
    const typeName = initialTypes[pieceCategory.typeId - 1].name;

    return `${t(capitalized(typeName))} • ${t(capitalized(categoryName))}`;
  }, [piece.categoryId, t]);

  return (
    <Box style={styles.card}>
      <Box style={styles.headerRow}>
        <Box>
          <Text style={styles.name}>{piece.name}</Text>
          <Text style={styles.typeAndCategory}>{formatTypeAndCategory()}</Text>
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
            <Text style={styles.infoValue}>1 mois</Text>
          </Box>
        </Box>
        <Box style={styles.column}>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Age")}</Text>
            <Text style={styles.infoValue}>{formatDays()}</Text>
          </Box>
          <Box style={styles.row}>
            <Text style={styles.infoLabel}>{t("Next action")}</Text>
            <Text style={styles.infoValue}>Mars 2026</Text>
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
