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
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { theme } from "@/constants/theme";

type DateFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  helperText?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<T>;
  error?: string;
  formatDate?: (value: string) => string;
};

export default function DateFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  helperText,
  isRequired = false,
  rules,
  error,
  formatDate = (v) => (v ? new Date(v).toLocaleDateString() : ""),
}: DateFormFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl
      isRequired={isRequired}
      style={styles.formControl}
      isInvalid={!!error}
    >
      <FormControlLabel>
        <FormControlLabelText style={styles.labelText}>
          {label}
        </FormControlLabelText>
      </FormControlLabel>
      {helperText && (
        <FormControlHelper>
          <FormControlHelperText style={styles.helperText}>
            {helperText}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setIsFocused(true);
                setIsOpen(true);
              }}
              style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                error && styles.inputContainerError,
              ]}
            >
              <TextInput
                value={formatDate(value ?? "")}
                placeholder={placeholder && placeholder}
                placeholderTextColor={theme.colors.text.tertiary}
                editable={false}
                pointerEvents="none"
                style={styles.textField}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>

            {isOpen && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setIsOpen(false);
                  if (selectedDate) {
                    setPickerDate(selectedDate);
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}
          </>
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
  formControl: { marginBottom: theme.spacing(2) },
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
    borderColor: theme.colors.border.lighting,
  },
  inputContainerError: {
    borderColor: theme.colors.border.error,
  },
  textField: {
    flex: 1,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing(1.5),
    fontSize: theme.typography.sizes.md,
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing(1),
  },
});
