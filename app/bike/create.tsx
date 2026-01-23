import { StyleSheet, View } from "react-native";
import { theme } from "@/app/constants/theme";
import CreateBikeForm from "@/app/components/forms/CreateBikeForm";

export default function CreateBikePage() {
  const onBikeCreated = (bikeId: number) => {
    console.log("Bike created with ID:", bikeId);
  };

  return (
    <View style={styles.safe}>
      <CreateBikeForm onSuccess={onBikeCreated} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
});
