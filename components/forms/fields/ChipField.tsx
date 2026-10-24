import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { makeStyles } from "@/hooks/useThemedStyles";
import FieldShell from "./FieldShell";

type Option = { value: number; label: string };

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: Option[];
  isRequired?: boolean;
  helperText?: string;
  error?: string;
};

export default function ChipField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  isRequired,
  helperText,
  error,
}: Props<T>) {
  const styles = useStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState }) => (
        <FieldShell
          label={label}
          helperText={helperText}
          isRequired={isRequired}
          error={error ?? fieldState.error?.message}
        >
          <View style={styles.container}>
            {options.map((option) => {
              const selected = value === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() => onChange(selected ? undefined : option.value)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.text, selected && styles.textSelected]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FieldShell>
      )}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  container: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing(1) },
  chip: {
    paddingVertical: theme.spacing(1),
    paddingHorizontal: theme.spacing(1.5),
    borderRadius: 16,
    backgroundColor: theme.colors.chip,
  },
  chipSelected: { backgroundColor: theme.colors.primary },
  text: { color: theme.colors.chipText },
  textSelected: { color: theme.colors.onPrimary },
}));
