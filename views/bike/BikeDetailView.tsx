import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { Divider } from "@/components/common/Divider";
import { PieceCard } from "@/components/piece/PieceCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { usePiecesByBike } from "@/hooks/usePiecesByBike";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Bike } from "@/database/models/BikeModel";
import { useTranslation } from "react-i18next";
import { useBikeContext } from "@/context/BikeContext";

type Props = NativeStackScreenProps<BikesStackParamList, "BikeDetail">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BikeDetailView({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { bikes, loading, error, deleteBike, refreshBikes } = useBikeContext();

  const bike = bikes.find((b) => b.id === bikeId);
  const { pieces } = usePiecesByBike(bikeId);
  const { t } = useTranslation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const brandAndModel = useCallback((bike: Bike) => {
    if (bike.brand && bike.model) {
      return `${bike.brand} • ${bike.model}`;
    } else if (bike.brand) {
      return bike.brand;
    } else if (bike.model) {
      return bike.model;
    } else {
      return "";
    }
  }, []);

  const onAddPiece = () => {
    navigation.navigate("PieceNavigator", {
      screen: "CreatePiece",
      params: {
        bikeId,
        bikeName: bike?.name,
      },
    });
  };

  const onEditBike = () => {
    bike && navigation.navigate("UpdateBike", { bike });
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  const navigateToPieceDetails = (pieceId: number) => {
    const selectedPiece = pieces.find((piece) => piece.id === pieceId);
    if (!selectedPiece) return;
    navigation.navigate("PieceNavigator", {
      screen: "PieceDetails",
      params: { piece: selectedPiece, bikeName: bike?.name },
    });
  };

  const onDeleteBike = useCallback(
    async (bike: Bike) => {
      await deleteBike(bike.id);
      if (!error) {
        setShowDeleteModal(false);
        await refreshBikes();
        navigation.goBack();
      }
    },
    [deleteBike, error, navigation, refreshBikes],
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !bike) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || "Bike not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Box style={styles.headerContainer}>
        <TouchableOpacity
          onPress={navigateBack}
          accessibilityLabel="Go Back"
          style={styles.backButton}
        >
          <Ionicons
            name={"chevron-back"}
            size={24}
            style={styles.backButtonIcon}
          />
          <Text style={styles.backButtonText}>{t("Back")}</Text>
        </TouchableOpacity>
        <Text style={styles.bikeName}>{bike?.name}</Text>
        <View style={styles.brandKm}>
          <Text style={styles.bikeModel}>{brandAndModel(bike)}</Text>
          <Text style={styles.bikeModel}>
            {bike.totalKm} {t("km")}
          </Text>
        </View>
        <Box style={styles.headerButtons}>
          <Button
            variant="solid"
            style={styles.updateButton}
            onPress={onEditBike}
          >
            <Ionicons
              name={"construct-outline"}
              size={20}
              style={styles.buttonIcon}
            />
            <ButtonText style={styles.updateText}>{t("Update")}</ButtonText>
          </Button>
          <Button
            style={styles.deleteButton}
            onPress={() => {
              setShowDeleteModal(true);
            }}
          >
            <Ionicons
              name={"trash-bin-outline"}
              size={25}
              style={styles.buttonIcon}
            />
          </Button>
        </Box>
      </Box>
      <Divider />
      <Box>
        <Box style={styles.piecesHeader}>
          <Text style={styles.pieceText}>{t("Pieces")}</Text>
          <Button onPress={onAddPiece} style={styles.addButton}>
            <Ionicons name={"add-outline"} size={20} style={styles.addIcon} />
            <ButtonText style={styles.addText}>{t("Add")}</ButtonText>
          </Button>
        </Box>
      </Box>
      <ScrollView showsVerticalScrollIndicator={false}>
        {pieces.map((piece) => {
          return (
            <TouchableOpacity
              key={piece.id}
              onPress={() => navigateToPieceDetails(piece.id)}
            >
              <PieceCard piece={piece} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
                {t("delete_bike_confirmation", { bike: bike.name })}
              </Text>
              <Text style={styles.deleteText}>{t("irreversible_action")}</Text>
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
                onPress={() => onDeleteBike(bike)}
              >
                <Text style={styles.modalButtonText}>{t("Delete")}</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  headerContainer: {
    marginBottom: theme.spacing(1),
  },
  backButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    height: 40,
    backgroundColor: "#2d333a",
    borderRadius: 12,
    margin: 20,
    marginLeft: 10,
    padding: 5,
  },
  backButtonIcon: {
    color: theme.colors.primaryLight,
    marginRight: theme.spacing(1),
  },
  backButtonText: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.sizes.md,
  },
  bikeName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing(2),
    color: theme.colors.text.primary,
  },
  brandKm: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bikeModel: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.secondary,
  },
  headerButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  updateButton: {
    flex: 3,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.primary,
  },
  buttonIcon: { color: theme.colors.text.primary },
  updateText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error,
  },
  piecesHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 10,
  },
  pieceText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  addIcon: {
    color: theme.colors.text.primary,
  },
  addText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  loading: {
    justifyContent: "center",
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
    marginTop: 20,
  },
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
