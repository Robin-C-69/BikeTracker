import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from "react-hook-form";
import { Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import FieldShell, {
  useInputStyles,
} from "@/components/forms/fields/FieldShell";
import { useTheme } from "@/hooks/useThemedStyles";

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
  const input = useInputStyles();
  const theme = useTheme();

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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => setIsOpen(true)}
              style={[
                input.container,
                isOpen && input.focused,
                !!message && input.error,
              ]}
            >
              <TextInput
                value={formatDate(value ?? "")}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.text.tertiary}
                editable={false}
                pointerEvents="none"
                style={input.textField}
              />
              <Ionicons
                name="calendar-outline"
                size={20}
                color={theme.colors.text.tertiary}
              />
            </Pressable>

            {isOpen && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="default"
                onValueChange={(_, selectedDate) => {
                  setIsOpen(false);
                  if (selectedDate) {
                    setPickerDate(selectedDate);
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}
          </FieldShell>
        );
      }}
    />
  );
}