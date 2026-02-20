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
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { StyleSheet, TextInput } from "react-native";
import { theme } from "@/constants/theme";
import DateFormField from "@/components/forms/fields/DateFormField";

type BaseFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  rules?: RegisterOptions<T>;
  error?: string;
};

type FormFieldProps<T extends FieldValues> =
  | (BaseFieldProps<T> & { type?: "text" | "numeric" | "email" | "password" })
  | (BaseFieldProps<T> & { type: "date"; formatDate?: (v: string) => string });

export default function FormField<T extends FieldValues>(
  props: FormFieldProps<T>,
) {
  if (props.type === "date") {
    return <DateFormField {...props} />;
  }

  const {
    control,
    name,
    label,
    placeholder,
    isRequired = false,
    rules,
    error,
    type = "text",
  } = props;

  return (
    <FormControl isRequired={isRequired}>
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.tertiary}
            inputMode={type === "password" ? "text" : type}
            secureTextEntry={type === "password"}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.textField}
          />
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
  textField: {
    color: theme.colors.text.primary,
    borderWidth: 1,
    borderColor: "#333",
    padding: 10,
    borderRadius: 6,
    marginBottom: theme.spacing(1),
  },
  error: {
    color: theme.colors.error,
    marginBottom: theme.spacing(1),
  },
});
