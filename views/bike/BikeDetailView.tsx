import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { Divider } from "@/components/common/Divider";
import { PieceCard } from "@/components/piece/PieceCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { useBike } from "@/hooks/useBike";
import { usePiecesByBike } from "@/hooks/usePiecesByBike";

type Props = NativeStackScreenProps<BikesStackParamList, "BikeDetail">;

export default function BikeDetailView({ navigation, route }: Props) {
  const { bikeId } = route.params;
  const { bikes, loading, error } = useBike();
  const bike = bikes.find((b) => b.id === bikeId);
  const { pieces } = usePiecesByBike(bikeId);

  const handleAddPiece = () => {
    navigation.navigate("CreatePiece", { bikeId });
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
        <Text style={styles.bikeName}>{bike?.name}</Text>
        <Text style={styles.bikeModel}>
          {bike?.brand} - {bike?.model}
        </Text>
        <Box style={styles.headerButtons}>
          <Button variant="solid" style={styles.updateButton}>
            <ButtonText>Modifier</ButtonText>
          </Button>
          <Button variant="solid" style={styles.deleteButton}>
            <ButtonText>Supprimer</ButtonText>
          </Button>
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
    flex: 1,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    flex: 1,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.error,
  },
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
