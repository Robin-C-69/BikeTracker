import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/constants/theme";

export default function Next() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
  },
});
