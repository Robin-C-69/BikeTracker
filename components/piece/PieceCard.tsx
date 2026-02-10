import React from "react";
import { StyleSheet, Text } from "react-native";
import { Divider } from "@/components/common/Divider";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";

export const PieceCard = () => {
  return (
    <Box style={styles.card}>
      <Box style={styles.headerRow}>
        <Box>
          <Text style={styles.name}>Chaine Shimano XT</Text>
          <Text style={styles.category}>Transmission</Text>
        </Box>
        <Box>
          <Text style={styles.state}>Bon état</Text>
        </Box>
      </Box>
      <Divider />
      <Box style={styles.details}>
        <Box style={styles.infos}>
          <Box style={styles.column}>
            <Box style={styles.row}>
              <Text style={styles.infoLabel}>Installé le</Text>
              <Text style={styles.infoValue}>1/2/3</Text>
            </Box>
            <Box style={styles.row}>
              <Text style={styles.infoLabel}>Durrée de vie</Text>
              <Text style={styles.infoValue}>1 mois</Text>
            </Box>
          </Box>
          <Box style={styles.column}>
            <Box style={styles.row}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>5 jours</Text>
            </Box>
            <Box style={styles.row}>
              <Text style={styles.infoLabel}>Prochaine révision</Text>
              <Text style={styles.infoValue}>Mars 2026</Text>
            </Box>
          </Box>
        </Box>
        <Box style={styles.infoBox}>
          <Text>Nettoyer tous les mois</Text>
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
  name: { color: "white" },
  category: { color: "white" },
  state: { color: "white" },
  details: {},
  infos: { flexDirection: "row" },
  column: {
    flexDirection: "column",
    flex: 1,
    marginBottom: theme.spacing(1),
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
  },
  infoLabel: { color: "white" },
  infoValue: { color: "white" },
  infoBox: {},
});
