import {
  FormControl,
  FormControlError,
  FormControlErrorText,
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
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { theme } from "@/constants/theme";

type DateFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
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
  isRequired = false,
  rules,
  error,
  formatDate = (v) => (v ? new Date(v).toLocaleDateString() : ""),
}: DateFormFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  return (
    <FormControl isRequired={isRequired}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <View style={{ position: "relative" }}>
              <Input isReadOnly>
                <InputField
                  value={formatDate(value ?? "")}
                  editable={false}
                  placeholder={placeholder}
                />
                <InputSlot>
                  <InputIcon>
                    <Ionicons name="calendar-outline" size={20} />
                  </InputIcon>
                </InputSlot>
              </Input>
              <TouchableOpacity
                style={StyleSheet.absoluteFillObject}
                onPress={() => setIsOpen(true)}
                activeOpacity={1}
              />
            </View>

            {isOpen && (
              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setIsOpen(false);
                  if (selectedDate) {
                    setPickerDate(selectedDate);
                    onChange(selectedDate.toISOString());
                  }
                }}
              />
            )}

            {error && (
              <FormControlError>
                <FormControlErrorText style={styles.error}>
                  {error ?? `${label} est obligatoire`}
                </FormControlErrorText>
              </FormControlError>
            )}
          </>
        )}
      />
    </FormControl>
  );
}

const styles = StyleSheet.create({
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing(1),
  },
});
