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
import { CreateBikeRequest } from "@/database/models/BikeModel";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import FormField from "@/components/forms/fields/FormField";

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
  } = useForm<CreateBikeRequest>({
    defaultValues: {
      name: "",
      brand: "",
      model: "",
      totalKm: undefined,
    },
  });

  const onSubmit = async (data: CreateBikeRequest) => {
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
          <FormField
            control={control}
            name={"name"}
            label={"Nom"}
            placeholder={"Nom du vélo"}
            isRequired={true}
          />
          <FormField
            control={control}
            name={"brand"}
            label={"Marque"}
            placeholder={"Marque du vélo"}
          />
          <FormField
            control={control}
            name={"model"}
            label={"Model"}
            placeholder={"Modèle du vélo"}
          />
          <FormField
            control={control}
            name={"totalKm"}
            label={"Total km"}
            placeholder={"Kilométrage du vélo"}
            type={"numeric"}
          />
          <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Créer</Text>
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
