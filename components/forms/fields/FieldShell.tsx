import { ReactNode } from "react";
import { Text, View } from "react-native";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props = {
  label: string;
  helperText?: string;
  error?: string;
  isRequired?: boolean;
  children: ReactNode;
};

export default function FieldShell({
  label,
  helperText,
  error,
  isRequired,
  children,
}: Props) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {isRequired ? <Text style={styles.required}> *</Text> : null}
      </Text>
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
      {children}
      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: { marginBottom: theme.spacing(2) },
  label: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.md,
    marginBottom: theme.spacing(0.5),
  },
  required: { color: theme.colors.text.error },
  helper: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.xs,
    marginBottom: theme.spacing(0.5),
  },
  error: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
    marginTop: theme.spacing(0.5),
  },
}));

export const useInputStyles = makeStyles((theme) => ({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    borderRadius: 14,
    paddingHorizontal: theme.spacing(1.5),
  },
  focused: { borderColor: theme.colors.text.lighting },
  error: { borderColor: theme.colors.border.error },
  textField: {
    flex: 1,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing(1.5),
    fontSize: theme.typography.sizes.md,
  },
}));