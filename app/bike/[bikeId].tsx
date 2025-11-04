import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/app/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useBike } from "@/app/hooks/useBike";

export default function BikeDetails() {
  const { bikeId } = useLocalSearchParams();
  const { bikes } = useBike();
  const currentBike = bikes.find((bike) => bike.id === Number(bikeId));

  if (!currentBike) {
    return (
      <View style={styles.container}>
        <Text>Error while getting bike</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bikeLabel}>{currentBike?.name}</Text>
      <Text>For bike: {bikeId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  },
  bikeLabel: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing(2),
    color: theme.colors.text,
    textAlign: "center",
  },
});
