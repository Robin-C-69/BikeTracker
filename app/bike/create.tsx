import { StyleSheet, View } from "react-native";
import { theme } from "@/constants/theme";
import CreateBikeForm from "@/components/forms/CreateBikeForm";
import { useRouter } from "expo-router";

export default function CreateBikePage() {
  const router = useRouter();

  const onBikeCreated = () => {
    router.navigate("/bike");
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
