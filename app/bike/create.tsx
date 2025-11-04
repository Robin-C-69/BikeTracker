import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { theme } from "@/app/constants/theme";
import { Controller, useForm } from "react-hook-form";
import { useBike } from "@/app/hooks/useBike";
import { ICreateBikeRequest } from "@/api/models/BikeModel";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateBikePage() {
  const router = useRouter();
  const { createBike } = useBike();
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
    const { errors } = await createBike(data);
    if (errors) {
      console.error(errors);
    }
    router.navigate("/bike");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.header}>Create new bike</Text>
          <Controller
            control={control}
            name={"name"}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={"Bike name"}
                placeholderTextColor={theme.colors.text}
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
                placeholderTextColor={theme.colors.text}
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
    color: theme.colors.text,
    fontSize: theme.typography.sizes.lg,
    marginBottom: theme.spacing(1.5),
  },
  textField: {
    color: theme.colors.text,
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
