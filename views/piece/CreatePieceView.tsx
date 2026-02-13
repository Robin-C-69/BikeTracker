import { Text, StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";

export const CreatePieceView = () => {
  return (
    <Box>
      <Box style={styles.card}>
        <Text>Here is the form</Text>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
  },
});
