import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { Bike } from "@/database/models/BikeModel";
import { Divider } from "@/components/common/Divider";
import { AddIconComponent } from "@/app/(tabs)/bike";
import { PieceCard } from "@/components/piece/PieceCard";

export default function BikeView({ bike }: { bike: Bike }) {
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
          <Button>
            <ButtonText>Ajouter</ButtonText>
          </Button>
        </Box>
      </Box>
      <PieceCard />
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
});
