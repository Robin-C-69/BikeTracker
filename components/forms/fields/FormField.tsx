import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Text, TextInput, View } from "react-native";
import { Theme } from "@/constants/theme";
import DateFormField from "@/components/forms/fields/DateFormField";
import { useState } from "react";
import FieldShell, {
  useInputStyles,
} from "@/components/forms/fields/FieldShell";
import { makeStyles, useTheme } from "@/hooks/useThemedStyles";

type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<T>;
  error?: string;
  endText?: string;
};

type FormFieldProps<T extends FieldValues> =
  | (BaseFieldProps<T> & { type?: "text" | "numeric" | "email" | "password" })
  | (BaseFieldProps<T> & { type: "date"; formatDate?: (v: string) => string });

export default function FormField<T extends FieldValues>(
  props: FormFieldProps<T>,
) {
  const [isFocused, setIsFocused] = useState(false);
  const styles = useStyles();
  const input = useInputStyles();
  const theme = useTheme();

  if (props.type === "date") {
    return <DateFormField {...props} />;
  }

  const {
    control,
    name,
    label,
    placeholder,
    helperText,
    isRequired = false,
    rules,
    error,
    type = "text",
    endText,
  } = props;

  const isPassword = type === "password";

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState }) => {
        const message = error ?? fieldState.error?.message;
        return (
          <FieldShell
            label={label}
            helperText={helperText}
            isRequired={isRequired}
            error={message}
          >
            <View
              style={[
                input.container,
                isFocused && input.focused,
                !!message && input.error,
              ]}
            >
              <TextInput
                accessibilityLabel={label}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.text.tertiary}
                inputMode={isPassword ? "text" : type}
                secureTextEntry={isPassword}
                onBlur={() => setIsFocused(false)}
                onFocus={() => setIsFocused(true)}
                onChangeText={(text) => {
                  if (type === "numeric") {
                    const num = Number(text);
                    onChange(
                      text === "" || Number.isNaN(num) ? undefined : num,
                    );
                  } else {
                    onChange(text);
                  }
                }}
                value={value != null ? String(value) : ""}
                style={[input.textField, !!endText && styles.withAdornment]}
              />
              {endText ? (
                <View style={styles.endAdornment}>
                  <Text style={styles.endText}>{endText}</Text>
                </View>
              ) : null}
            </View>
          </FieldShell>
        );
      }}
    />
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  endAdornment: {
    paddingLeft: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
  },
  endText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
  },
  withAdornment: { paddingRight: theme.spacing(1) },
}));
