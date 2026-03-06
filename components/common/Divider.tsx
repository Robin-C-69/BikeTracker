import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
};

export const Divider = ({ style }: Props) => {
  return <View style={[styles.divider, style]} />;
};

const styles = StyleSheet.create({
  divider: {
    height: 0.5,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 10,
  },
});
