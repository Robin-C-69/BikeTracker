import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import { NotificationBar } from "@/components/common/NotificationBar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Directory, File, Paths } from "expo-file-system";

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

  const [localImageUri, setLocalImageUri] = useState<string | undefined>(
    bike?.imageUri,
  );

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    brand: z.string().optional(),
    model: z.string().optional(),
    totalKm: z.number().min(0, "Mileage must be a positive number").optional(),
    imageUri: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateBikeRequest>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: bike?.name ?? "",
      brand: bike?.brand ?? "",
      model: bike?.model ?? "",
      totalKm: bike?.totalKm ?? 0,
      imageUri: bike?.imageUri ?? "",
    },
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedImageUri = result.assets[0].uri;
      const fileName = selectedImageUri.split("/").pop() ?? "image.jpg";
      const destDir = new Directory(Paths.document, "bikes");
      if (!destDir.exists) {
        destDir.create();
      }

      const sourceFile = new File(selectedImageUri);
      const destFile = new File(destDir, fileName);
      sourceFile.copy(destFile);

      setLocalImageUri(destFile.uri);
      setValue("imageUri", destFile.uri, { shouldDirty: true });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const bikeData: CreateBikeRequest = {
        name: data.name,
        brand: data.brand,
        model: data.model,
        totalKm: data.totalKm,
        imageUri: data.imageUri,
      };

      if (isUpdate) {
        await updateBike(bike.id, bikeData);
      } else {
        await createBike(bikeData);
      }
      onSuccess?.();
    } catch (e) {
      console.error("Failed to create piece", e);
      Alert.alert("Error", "Failed to create piece");
    }
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
          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {localImageUri ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: localImageUri }}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => {
                    setLocalImageUri(undefined);
                    setValue("imageUri", "");
                  }}
                  style={styles.removeImageBtn}
                >
                  <Ionicons name={"close-circle"} size={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={32}
                  style={styles.cameraIcon}
                />
                <Text style={styles.imagePickerText}>{t("Add a photo")}</Text>
              </>
            )}
          </TouchableOpacity>
          <FormField
            control={control}
            name={"name"}
            label={t("Name")}
            placeholder={"My super bike"}
            helperText={t("An easy to remind name to identify your bike")}
            isRequired={true}
            rules={{ required: t("field_required") }}
            error={errors.name?.message}
          />
          <FormField
            control={control}
            name={"brand"}
            label={t("Brand")}
            placeholder={"Eg: Trek, Specialized, Giant..."}
          />
          <FormField
            control={control}
            name={"model"}
            label={t("Model")}
            placeholder={"Eg: Slash, Stumpjumper, Trance..."}
          />
          <FormField
            control={control}
            name={"totalKm"}
            label={t("Mileage")}
            placeholder={"Eg: 0, 1500, 30000..."}
            helperText={t(
              "If you don't know the exact one, an estimation is enough",
            )}
            type={"numeric"}
            endText={"km"}
            rules={{
              min: { value: 0, message: t("mileage_min") },
              valueAsNumber: true,
            }}
            error={errors.totalKm?.message}
          />
          <NotificationBar type="success" style={styles.kmHint}>
            <Ionicons
              name={"bulb-outline"}
              size={25}
              style={styles.kmHintIcon}
            />
            <Text style={styles.kmHintText}>{t("mileage_hint")}</Text>
          </NotificationBar>
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
  imagePicker: {
    height: 180,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageBtn: {
    position: "absolute",
    top: theme.spacing(-1),
    right: theme.spacing(-1),
    zIndex: 10,
  },
  cameraIcon: {
    color: theme.colors.text.secondary,
  },
  imagePickerText: {
    color: theme.colors.text.secondary,
    marginTop: theme.spacing(0.5),
  },
  removeImageText: {
    color: theme.colors.error,
    fontSize: theme.typography.sizes.sm,
  },
  kmHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing(-1),
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
