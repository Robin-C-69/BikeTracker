import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  ActivityIndicator,
  Alert,
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
import { useBike } from "@/hooks/useBike";
import { usePiecesByBike } from "@/hooks/usePiecesByBike";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { Bike } from "@/database/models/BikeModel";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<BikesStackParamList, "BikeDetail">;

export default function BikeDetailView({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { bikes, loading, error } = useBike();
  const bike = bikes.find((b) => b.id === bikeId);
  const { pieces } = usePiecesByBike(bikeId);
  const { t } = useTranslation();

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

  const handleAddPiece = () => {
    navigation.navigate("CreatePiece", { bikeId });
  };
  const navigateBack = () => {
    navigation.goBack();
  };

  const handleEditBike = () => {
    Alert.alert("Edit", "Edit functionality coming soon!");
  };

  const handleDeleteBike = () => {
    Alert.alert(
      "Delete Bike",
      `Are you sure you want to delete ${bike?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
        },
      ],
    );
  };

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
        <Text style={styles.bikeModel}>{brandAndModel(bike)}</Text>
        <Box style={styles.headerButtons}>
          <Button variant="solid" style={styles.updateButton}>
            <ButtonText style={styles.updateText}>{t("Update")}</ButtonText>
          </Button>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteBike}
          >
            <Ionicons
              name={"trash-bin-outline"}
              size={30}
              style={styles.deleteIcon}
            />
          </TouchableOpacity>
        </Box>
      </Box>
      <Divider />
      <Box>
        <Box style={styles.piecesHeader}>
          <Text style={styles.pieceText}>Pièces</Text>
          <Button onPress={handleAddPiece}>
            <ButtonText>Ajouter</ButtonText>
          </Button>
        </Box>
      </Box>
      {pieces.map((piece) => {
        return <PieceCard key={piece.id} piece={piece} />;
      })}
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
  updateText: { color: theme.colors.text.primary },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.error,
  },
  deleteIcon: { color: theme.colors.text.primary },
  piecesHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pieceText: { color: theme.colors.text.primary },
  loading: {
    justifyContent: "center",
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
    marginTop: 20,
  },
});
