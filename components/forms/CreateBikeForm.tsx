import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { useForm } from "react-hook-form";
import { Bike, CreateBikeRequest } from "@/database/models/BikeModel";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/components/forms/fields/FormField";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useBikeContext } from "@/context/BikeContext";

export default function CreateBikeForm({
  onSuccess,
  bike,
}: {
  onSuccess?: () => void;
  bike?: Bike;
}) {
  const { t } = useTranslation();
  const { error, loading, createBike, updateBike } = useBikeContext();
  const isUpdate = !!bike;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBikeRequest>({
    defaultValues: {
      name: bike?.name ?? "",
      brand: bike?.brand ?? "",
      model: bike?.model ?? "",
      totalKm: bike?.totalKm ?? 0,
    },
  });

  const onSubmit = async (data: CreateBikeRequest) => {
    if (isUpdate) {
      await updateBike(bike.id, data);
    } else {
      await createBike(data);
    }
    onSuccess?.();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.header}>
          {isUpdate ? t("Updating...") : t("Creating...")}
        </Text>
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
            label={"Name"}
            placeholder={"My super bike"}
            helperText={"An easy to remind name to identify your bike"}
            isRequired={true}
            rules={{ required: t("field_required") }}
            error={errors.name?.message}
          />
          <FormField
            control={control}
            name={"brand"}
            label={"Brand"}
            placeholder={"Eg: Trek, Specialized, Giant..."}
          />
          <FormField
            control={control}
            name={"model"}
            label={"Model"}
            placeholder={"Eg: Slash, Stumpjumper, Trance..."}
          />
          <FormField
            control={control}
            name={"totalKm"}
            label={"Mileage"}
            placeholder={"Eg: 0, 1500, 30000..."}
            helperText={
              "If you don't know the exact one, an estimation is enough"
            }
            type={"numeric"}
            endText={"km"}
            rules={{
              min: { value: 0, message: t("mileage_min") },
              valueAsNumber: true,
            }}
            error={errors.totalKm?.message}
          />
          <View style={styles.kmHint}>
            <Ionicons
              name={"bulb-outline"}
              size={25}
              style={styles.kmHintIcon}
            />
            <Text style={styles.kmHintText}>{t("mileage_hint")}</Text>
          </View>
          <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>
              {isUpdate ? t("Update") : t("Create")}
            </Text>
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
  kmHint: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: theme.spacing(-1),
    backgroundColor: theme.colors.greenHint,
    borderRadius: 14,
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.primaryDark,
  },
  kmHintIcon: {
    color: theme.colors.warning,
  },
  kmHintText: {
    paddingRight: 10,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing(1),
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
    marginTop: theme.spacing(2.5),
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
});
