import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { useBike } from "@/hooks/useBike";
import BikeView from "@/views/BikeView";

export default function BikeDetails() {
  const { bikeId } = useLocalSearchParams();
  const { bikes } = useBike();
  // const currentBike = bikes.find((bike) => bike.id === Number(bikeId));

  const currentBike = {
    id: 0,
    name: "Mock bike",
    brand: "Mock brand",
    model: "Mock model",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  }; // Temporary mock until hook is functional

  if (!currentBike) {
    return (
      <View style={styles.container}>
        <Text>Error while getting bike</Text>
      </View>
    );
  }

  return <BikeView bike={currentBike} />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  },
});
