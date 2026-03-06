import { StyleSheet, Text, View } from "react-native";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { Divider } from "@/components/common/Divider";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export const HistoryCard = ({
  historyEntry,
}: {
  historyEntry: MaintenanceHistoryWithType;
}) => {
  const { t } = useTranslation();

  const dateOptions = {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
  } as const;
  const dateDone = new Date(historyEntry.date).toLocaleDateString(
    "fr",
    dateOptions,
  );

  const formatBikeKm = useCallback(() => {
    return `${t("Bike km")} : ${historyEntry.kmAtMaintenance} km`;
  }, [historyEntry.kmAtMaintenance, t]);

  return (
    <View style={styles.container}>
      <View style={styles.timelineContainer}>
        <View style={styles.dotContainer}>
          <View style={styles.dot}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        <View style={styles.verticalLine} />
      </View>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View style={styles.headerInfos}>
            <Text style={styles.name}>
              {t(`maintenance_type.${historyEntry.maintenanceType.name}`)}
            </Text>
            <Text style={styles.notes}>{historyEntry.notes}</Text>
          </View>
          <View>
            <Text style={styles.date}>{dateDone}</Text>
          </View>
        </View>
        <Divider />
        <View>
          <Text style={styles.bikeKm}>{formatBikeKm()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  timelineContainer: {
    alignItems: "center",
    marginRight: theme.spacing(2),
  },
  dotContainer: {
    width: 24,
    height: 24,
    zIndex: 2,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    borderWidth: 3,
    borderColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    // Shadow for iOS
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  checkmark: {
    color: theme.colors.background,
    fontSize: 12,
    fontWeight: "700",
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border.default,
    marginTop: -2,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    marginBottom: theme.spacing(1.5),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerInfos: {
    gap: theme.spacing(0.5),
    flex: 1,
  },
  name: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.lg,
  },
  notes: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
  },
  date: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.sm,
  },
  bikeKm: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.sm,
  },
});
