import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
} from "react-native";
import { makeStyles, useTheme } from "@/hooks/useThemedStyles";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "solid" | "outline" | "danger";
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  title,
  onPress,
  variant = "solid",
  loading = false,
  disabled = false,
  style,
}: Props) {
  const styles = useStyles();
  const theme = useTheme();
  const isDisabled = disabled || loading;
  const isOutline = variant === "outline";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={isOutline ? theme.colors.primary : theme.colors.onPrimary}
        />
      ) : (
        <Text style={[styles.text, isOutline && styles.textOutline]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles((theme) => ({
  base: {
    minHeight: 48,
    paddingHorizontal: theme.spacing(2),
    borderRadius: theme.spacing(2.5),
    alignItems: "center",
    justifyContent: "center",
  },
  solid: { backgroundColor: theme.colors.primary },
  danger: { backgroundColor: theme.colors.error },
  outline: { borderWidth: 1, borderColor: theme.colors.primary },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  text: {
    color: theme.colors.onPrimary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
  textOutline: { color: theme.colors.primary },
}));
