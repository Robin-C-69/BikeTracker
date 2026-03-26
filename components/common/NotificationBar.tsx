import { StyleSheet, View, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { theme } from "@/constants/theme";

type Props = {
  type?: "success" | "warning" | "error";
  style?: ViewStyle;
  children: ReactNode;
};

export const NotificationBar = ({
  type = "success",
  style,
  children,
}: Props) => {
  return <View style={[styles.base, styles[type], style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    display: "flex",
    padding: 10,
    borderRadius: 14,
    borderLeftWidth: 5,
  },
  success: {
    backgroundColor: theme.colors.greenHint,
    borderColor: theme.colors.primaryDark,
  },
  warning: {
    backgroundColor: theme.colors.warningDark,
    borderColor: theme.colors.warning,
  },
  error: {
    backgroundColor: theme.colors.errorDark,
    borderColor: theme.colors.error,
  },
});
