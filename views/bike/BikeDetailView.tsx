import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { PieceCard } from "@/components/piece/PieceCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { usePiecesByBike } from "@/hooks/usePiecesByBike";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Bike } from "@/database/models/BikeModel";
import { useTranslation } from "react-i18next";
import { useBikeContext } from "@/context/BikeContext";
import {
  BIKE_DETAIL,
  CREATE_PIECE,
  PIECE_DETAILS,
  PIECE_NAVIGATOR,
  UPDATE_BIKE,
} from "@/constants/tabNames";
import CustomHeader from "@/components/common/CustomHeader";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { PieceCategoryWithType } from "@/database/models/PieceCategoryModel";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/common/Accordion";

const PlaceholderImage = require("@/assets/images/bike.png");

type Props = NativeStackScreenProps<BikesStackParamList, typeof BIKE_DETAIL>;

type PiecesByCategory = Record<
  number,
  {
    category: PieceCategoryWithType;
    pieces: PieceWithDetails[];
  }
>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BikeDetailView({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { bikes, loading, error, deleteBike } = useBikeContext();

  const bike = bikes.find((b) => b.id === bikeId);
  const {
    pieces,
    loading: piecesLoading,
    error: piecesError,
  } = usePiecesByBike(bikeId);
  const { t } = useTranslation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sortedByCategory = (pieces: PieceWithDetails[]): PiecesByCategory => {
    const grouped = pieces.reduce<PiecesByCategory>((acc, piece) => {
      const categoryId = piece.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = { category: piece.category, pieces: [] };
      }
      acc[categoryId].pieces.push(piece);
      return acc;
    }, {});

    return Object.fromEntries(
      Object.entries(grouped).sort(([a], [b]) => Number(a) - Number(b)),
    );
  };

  const sortedPieces = pieces ? sortedByCategory(pieces) : null;

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
    navigation.navigate(PIECE_NAVIGATOR, {
      screen: CREATE_PIECE,
      params: {
        bikeId,
        bikeName: bike?.name,
      },
    });
  };

  const onEditBike = () => {
    bike && navigation.navigate(UPDATE_BIKE, { bike });
  };

  const navigateToPieceDetails = (pieceId: number) => {
    const selectedPiece = pieces.find((piece) => piece.id === pieceId);
    if (!selectedPiece) return;
    navigation.navigate(PIECE_NAVIGATOR, {
      screen: PIECE_DETAILS,
      params: { piece: selectedPiece, bikeName: bike?.name },
    });
  };

  const onDeleteBike = useCallback(
    async (bike: Bike) => {
      await deleteBike(bike.id);
      if (!error) {
        setShowDeleteModal(false);
        navigation.goBack();
      }
    },
    [deleteBike, error, navigation],
  );

  if (loading || piecesLoading || !sortedPieces) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !bike || piecesError) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || "Bike not found"}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title={t("Bike details")}
        actionButton={{ label: t("Edit"), onPress: onEditBike, visible: true }}
      />
      <Box style={styles.headerContainer}>
        <Image
          source={bike.imageUri ? { uri: bike.imageUri } : PlaceholderImage}
          style={styles.bikeImage}
        />
        <View style={styles.bikeInfos}>
          <View style={styles.bikeLabels}>
            <Text style={styles.bikeName}>{bike?.name}</Text>
            <Text style={styles.bikeModel}>{brandAndModel(bike)}</Text>
          </View>
          <View style={styles.bikeStats}>
            <Box>
              <Text style={styles.statName}>{t("Traveled distance")}</Text>
              <Text style={styles.statValue}>
                {bike.totalKm}
                {t(" km")}
              </Text>
            </Box>
          </View>
        </View>
      </Box>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sortedPieces && (
          <Accordion
            type="multiple"
            defaultValue={Object.values(sortedPieces).map(
              (cat) => cat.category.name,
            )}
          >
            {Object.values(sortedPieces).map((cat, idx) => (
              <AccordionItem key={cat.category.id} value={cat.category.name}>
                <AccordionHeader>
                  <AccordionTrigger>
                    <AccordionTitleText>
                      {`${String(idx + 1).padStart(2, "0")} // ${t(`categories.${cat.category.name}`)}`}
                    </AccordionTitleText>
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  {cat.pieces.map((piece) => (
                    <TouchableOpacity
                      key={piece.id}
                      onPress={() => navigateToPieceDetails(piece.id)}
                    >
                      <PieceCard key={piece.id} piece={piece} />
                    </TouchableOpacity>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        <TouchableOpacity
          style={[styles.actionCard, styles.addButton]}
          onPress={onAddPiece}
        >
          <Ionicons
            name={"add-circle-outline"}
            size={25}
            style={styles.addIcon}
          />
          <Text style={styles.addText}>{t("Add piece")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionCard, styles.deleteButton]}
          onPress={() => {
            setShowDeleteModal(true);
          }}
        >
          <Ionicons
            name={"trash-bin-outline"}
            size={20}
            style={styles.deleteIcon}
          />
          <Text style={styles.deleteButtonTitle}>{t("Delete bike")}</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="none"
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
                <Text style={styles.modalCancelText}>{t("Cancel")}</Text>
              </Button>
              <Button
                style={styles.modalDelete}
                onPress={() => onDeleteBike(bike)}
              >
                <Text style={styles.modalDeleteText}>{t("Delete")}</Text>
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
    display: "flex",
    flexDirection: "row",
    gap: theme.spacing(2),
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing(1),
    borderBottomColor: theme.colors.border.default,
    borderBottomWidth: 1,
    padding: theme.spacing(2),
  },
  bikeImage: {
    width: "20%",
    height: "70%",
    resizeMode: "cover",
  },
  bikeInfos: {
    gap: theme.spacing(1),
  },
  bikeLabels: {
    marginBottom: theme.spacing(1),
  },
  bikeName: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.lighting,
  },
  bikeModel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  bikeStats: {
    flexDirection: "row",
    gap: theme.spacing(1),
  },
  statName: {
    color: theme.colors.text.secondary,
  },
  statValue: {
    color: theme.colors.text.primary,
  },
  loading: {
    justifyContent: "center",
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
    marginTop: 20,
  },
  actionCard: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(1.5),
    borderRadius: theme.spacing(0.5),
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addButton: {
    height: SCREEN_WIDTH * 0.3,
    marginBottom: theme.spacing(1.5),
    borderColor: theme.colors.border.default,
  },
  addText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    marginTop: theme.spacing(0.5),
  },
  addIcon: {
    color: theme.colors.primary,
  },
  deleteButton: {
    backgroundColor: theme.colors.errorDark,
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
    borderColor: theme.colors.border.error,
  },
  deleteButtonTitle: {
    color: theme.colors.text.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  deleteIcon: {
    color: theme.colors.error,
    marginTop: theme.spacing(0.5),
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    padding: 10,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: theme.spacing(0.5),
    borderColor: theme.colors.border.default,
    borderWidth: 1,
  },
  deleteTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    textAlign: "center",
  },
  modalButtonsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  modalCancel: {
    width: "45%",
    height: theme.spacing(7),
    backgroundColor: "transparent",
    borderRadius: theme.spacing(0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.disabled,
  },
  modalCancelText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  modalDelete: {
    width: "45%",
    height: theme.spacing(7),
    backgroundColor: theme.colors.errorDark,
    borderRadius: theme.spacing(0.5),
    borderColor: theme.colors.border.error,
    borderWidth: 1,
  },
  modalDeleteText: {
    color: theme.colors.text.error,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});
