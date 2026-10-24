import React from "react";
import { View, ViewStyle } from "react-native";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props = {
  style?: ViewStyle;
};

export const Divider = ({ style }: Props) => {
  const styles = useStyles();
  return <View style={[styles.divider, style]} />;
};

const useStyles = makeStyles((theme) => ({
  divider: {
    height: 0.5,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 10,
  },
}));
