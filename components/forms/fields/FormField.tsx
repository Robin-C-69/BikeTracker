import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { theme } from "@/constants/theme";
import DateFormField from "@/components/forms/fields/DateFormField";
import { useTranslation } from "react-i18next";
import { useState, ReactNode } from "react";

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
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

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
    <FormControl
      isRequired={isRequired}
      style={styles.formControl}
      isInvalid={!!error}
    >
      <FormControlLabel>
        <FormControlLabelText style={styles.labelText}>
          {t(label)}
        </FormControlLabelText>
      </FormControlLabel>
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText style={styles.helperText}>
            {t(helperText)}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              placeholder={placeholder && t(placeholder)}
              placeholderTextColor={theme.colors.text.tertiary}
              inputMode={isPassword ? "text" : type}
              secureTextEntry={isPassword}
              onBlur={() => setIsFocused(false)}
              onFocus={() => setIsFocused(true)}
              onChangeText={(text) => {
                if (type === "numeric") {
                  onChange(text === "" ? undefined : Number(text));
                } else {
                  onChange(text);
                }
              }}
              value={value}
              style={[
                styles.textField,
                endText && styles.textFieldWithAdornment,
              ]}
            />

            {endText && (
              <View style={styles.endAdornment}>
                <Text style={styles.endText}>{t(endText)}</Text>
              </View>
            )}
          </View>
        )}
      />
      {error && (
        <FormControlError>
          <FormControlErrorText style={styles.error}>
            {error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}

const styles = StyleSheet.create({
  formControl: { marginBottom: theme.spacing(3) },
  labelText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.md,
  },
  helperText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing(-0.5),
    marginBottom: theme.spacing(0.5),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    borderRadius: 14,
    paddingHorizontal: theme.spacing(1.5),
  },
  inputContainerFocused: {
    borderColor: theme.colors.border.focus,
  },
  textField: {
    flex: 1,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing(1.5),
    fontSize: theme.typography.sizes.md,
  },
  textFieldWithAdornment: {
    paddingRight: theme.spacing(1), // small gap before the adornment
  },
  endAdornment: {
    paddingLeft: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
  },
  endText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
  },
  endAdornmentIcon: {
    fontSize: 18,
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing(1),
  },
});
