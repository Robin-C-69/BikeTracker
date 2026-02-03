import React from "react";
import { View, StyleSheet } from "react-native";

export const Divider = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: "#ccc", // Grey color
    width: "100%", // Full width
    marginVertical: 10, // Optional: adds vertical spacing
  },
});
