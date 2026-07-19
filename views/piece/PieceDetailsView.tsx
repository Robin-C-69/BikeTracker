import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonText } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { PieceHistory } from "@/components/history/PieceHistory";
import { usePieceMutations } from "@/hooks/usePieceMutations";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { useBikeContext } from "@/context/BikeContext";
import {
  formatDateToHumanString,
  formatPieceTypeAndCategory,
} from "@/components/utils/stringFormatting";
import { useMaintenanceHistoryStore } from "@/stores/historyStore";
import {
  CREATE_HISTORY_ENTRY,
  PIECE_DETAILS,
  UPDATE_PIECE,
} from "@/constants/tabNames";
import CustomHeader from "@/components/common/CustomHeader";

type Props = NativeStackScreenProps<PieceStackParamList, typeof PIECE_DETAILS>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const PieceDetailsView = ({ navigation, route }: Props) => {
  const { piece } = route.params;
  const { t } = useTranslation();

  const { deletePiece } = usePieceMutations();

  const { bikes } = useBikeContext();
  const currentBike = bikes.find((bike) => bike.id === piece.bikeId);

  const { historyByPiece } = useMaintenanceHistoryStore();
  const maintenanceHistory = useMemo(() => {
    return historyByPiece[piece.id] ?? piece.maintenanceHistory ?? [];
  }, [historyByPiece, piece.id, piece.maintenanceHistory]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const nameAndCategory = useMemo(() => {
    return formatPieceTypeAndCategory(piece.category, t);
  }, [piece.category, t]);

  const pieceInstalledDate = useCallback(() => {
    return formatDateToHumanString(piece.installDate) ?? "-";
  }, [piece.installDate]);

  const navigateToCreateHistoryEntry = () => {
    navigation.navigate(CREATE_HISTORY_ENTRY, {
      pieceWithDetails: piece,
    });
  };

  const onEditPiece = () => {
    piece &&
      currentBike &&
      navigation.navigate(UPDATE_PIECE, {
        bikeId: currentBike.id,
        bikeName: currentBike.name,
        piece: piece,
      });
  };

  const onDeletePiece = useCallback(
    async (piece: PieceWithDetails) => {
      await deletePiece(piece.id);
      setShowDeleteModal(false);
      navigation.goBack();
    },
    [deletePiece, navigation],
  );

  const HeaderSpec = ({ label, value }: { label: string; value: string }) => {
    return (
      <View style={styles.headerDetailsItem}>
        <View>
          <Text style={styles.hdLabel}>{label}</Text>
        </View>
        <View>
          <Text style={styles.hdValue}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={t("Piece details")}
        actionButton={{ label: t("Edit"), onPress: onEditPiece, visible: true }}
      />
      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.headerNames}>
            <Text style={styles.pieceName}>{piece.name}</Text>
            {nameAndCategory && (
              <Text style={styles.modelCategory}>{nameAndCategory}</Text>
            )}
            {piece.description && (
              <Text style={styles.pieceDescription}>{piece.description}</Text>
            )}
          </View>
          <View style={styles.headerDetails}>
            <HeaderSpec label={t("Bike")} value={currentBike?.name ?? "-"} />
            <HeaderSpec
              label={t("Installed date")}
              value={pieceInstalledDate()}
            />
          </View>
        </View>
        <View style={styles.historyContainer}>
          <View>
            <Text style={styles.historyLabel}>{t("History")}</Text>
            <Text style={styles.historySubLabel}>
              {maintenanceHistory.length} {t("Interventions")}
            </Text>
          </View>
          <Button
            style={styles.addHistoryButton}
            onPress={navigateToCreateHistoryEntry}
          >
            <Ionicons name={"add-outline"} size={20} style={styles.addIcon} />
            <ButtonText style={styles.actionText}>{t("Add")}</ButtonText>
          </Button>
        </View>
        <PieceHistory
          piece={piece}
          history={maintenanceHistory}
          navigation={navigation}
        />
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={() => {
            setShowDeleteModal(false);
          }}
        >
          <View style={styles.modalWrapper}>
            <View style={styles.modalContainer}>
              <View style={styles.deleteTextWrapper}>
                <Text style={styles.deleteText}>
                  {t("delete_piece_confirmation", { piece: piece.name })}
                </Text>
                <Text style={styles.deleteText}>
                  {t("irreversible_action")}
                </Text>
              </View>
              <View style={styles.modalButtonsWrapper}>
                <Button
                  style={styles.modalCancel}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text style={styles.modalButtonText}>{t("Cancel")}</Text>
                </Button>
                <Button
                  style={styles.modalDelete}
                  onPress={() => onDeletePiece(piece)}
                >
                  <Text style={styles.modalButtonText}>{t("Delete")}</Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  headerContainer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    justifyContent: "space-between",
    // alignItems: "center",
    gap: theme.spacing(2),
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing(1),
    borderBottomColor: theme.colors.border.default,
    borderBottomWidth: 1,
  },
  headerNames: { gap: theme.spacing(1) },
  pieceName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
  modelCategory: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
  },
  pieceDescription: {
    color: theme.colors.text.primary,
  },
  headerDetails: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
  headerDetailsItem: {
    width: "48%",
  },
  headerDetailsLabel: {},
  headerDetailsValue: {},
  hdLabel: { color: theme.colors.text.secondary },
  hdValue: { color: theme.colors.text.primary },
  pieceButtons: { flexDirection: "column", gap: theme.spacing(1) },
  cardsContainer: {
    padding: theme.spacing(1),
    display: "flex",
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  column: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing(1),
  },
  row: { flex: 1 },
  statCardContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: theme.colors.border.default,
    padding: 10,
  },
  statCardLabel: { color: theme.colors.text.tertiary },
  statCardValue: { color: theme.colors.text.primary },
  historyContainer: {
    padding: theme.spacing(1),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLabel: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.lg,
  },
  historySubLabel: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.sm,
  },
  addHistoryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: theme.colors.border.lighting,
  },
  addIcon: {
    color: theme.colors.text.primary,
  },
  actionText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  deletePieceButton: { backgroundColor: theme.colors.error },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    padding: 10,
    backgroundColor: theme.colors.surfaceVariant,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: theme.spacing(1.5),
    justifyContent: "center",
  },
  deleteTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  modalButtonsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  modalCancel: {
    width: 130,
    height: 50,
    backgroundColor: "transparent",
    borderRadius: theme.spacing(1.5),
    borderWidth: 1,
  },
  modalDelete: {
    width: 130,
    height: 50,
    backgroundColor: theme.colors.error,
    borderRadius: theme.spacing(1.5),
  },
  modalButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});
