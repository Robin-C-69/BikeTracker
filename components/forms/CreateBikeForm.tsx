import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { theme } from "@/constants/theme";
import { Controller, useForm } from "react-hook-form";
import { useBike } from "@/hooks/useBike";
import { ICreateBikeRequest } from "@/database/models/BikeModel";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateBikeForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { error, loading, createBike } = useBike();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateBikeRequest>({
    defaultValues: {
      name: "",
      brand: "",
    },
  });

  const onSubmit = async (data: ICreateBikeRequest) => {
    await createBike(data);
    if (onSuccess) {
      onSuccess();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.header}>Creating Bike...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.header}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Controller
            control={control}
            name={"name"}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={"Bike name"}
                placeholderTextColor={theme.colors.text.primary}
                inputMode={"text"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textField}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.error}>This is a required field</Text>
          )}
          <Controller
            control={control}
            name={"brand"}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={"Brand name"}
                placeholderTextColor={theme.colors.text.primary}
                inputMode={"text"}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textField}
              />
            )}
          />
          <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Create</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
  },
  content: { padding: theme.spacing(2), flexGrow: 1 },
  header: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing(1.5),
  },
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
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: theme.spacing(1),
  },
  buttonText: { color: "#000", fontWeight: "600" },
});
