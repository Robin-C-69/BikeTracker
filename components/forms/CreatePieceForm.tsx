import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useDatabase } from "@/context/DatabaseContext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { PieceCategoryRepository } from "@/database/repositories/PieceCategoryRepository";
import { Category } from "@/database/models/PieceCategoryModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { CreatePiece, PieceWithDetails } from "@/database/models/PieceModel";
import { Button, ButtonText } from "@/components/ui/button";
import FormField from "@/components/forms/fields/FormField";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { usePieceMutations } from "@/hooks/usePieceMutations";
import { NotificationBar } from "@/components/common/NotificationBar";

type Props = {
  bikeId: number;
  bikeName?: string;
  piece?: PieceWithDetails;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function CreatePieceForm({
  bikeId,
  bikeName,
  piece,
  onSuccess,
  onCancel,
}: Props) {
  const { db } = useDatabase();
  const { createPiece, updatePiece } = usePieceMutations();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const isUpdate = !!piece;

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.number({ error: "Category is required" }).int(),
    description: z.string().optional(),
    installDate: z.string().optional(),
    installKm: z
      .number()
      .int()
      .min(0, "Kilometers cannot be negative")
      .optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: piece?.name ?? "",
      categoryId: piece?.categoryId ?? undefined,
      description: piece?.description ?? "",
      installDate: piece?.installDate ?? "",
      installKm: piece?.installKm ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!db) {
      return;
    }
    try {
      const pieceData: CreatePiece = {
        bikeId: bikeId,
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        installDate: data.installDate || undefined,
        installKm: data.installKm ?? undefined,
      };

      if (isUpdate) {
        await updatePiece(piece.id, pieceData);
      } else {
        await createPiece(pieceData);
      }
      onSuccess?.();
    } catch (e) {
      console.error("Failed to create piece", e);
      Alert.alert("Error", "Failed to create piece");
    }
  };

  // Load types and category on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!db) return;
        const categoryRepo = new PieceCategoryRepository(db);
        const categoriesData = await categoryRepo.findAll();

        setCategories(categoriesData);
      } catch (e) {
        console.error("Failed to load types or categories", e);
        Alert.alert("Error", "Failed to load types or categories");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [db]);

  if (isLoading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <Box style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <VStack space="md" style={styles.form}>
          <NotificationBar type="success">
            <Text style={styles.addTo}>{t("Add to")}</Text>
            <Text style={styles.bikeName}>{bikeName}</Text>
          </NotificationBar>
          <FormField
            control={control}
            name={"name"}
            label={t("Name")}
            isRequired={true}
            placeholder={t("Name")}
            error={errors.name?.message}
          />
          <FormField
            control={control}
            name={"description"}
            label={t("Description")}
            placeholder={t("Description")}
          />
          <FormControl isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText style={styles.labelText}>
                {t("Category")}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name={"categoryId"}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.chipsContainer}>
                  {categories.map((category) => {
                    const isSelected = value === category.id;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        onPress={() =>
                          onChange(
                            value === category.id ? undefined : category.id,
                          )
                        }
                        onBlur={onBlur}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        activeOpacity={1}
                      >
                        <Text style={styles.chipText}>
                          {t(`categories.${category.name}`, {
                            defaultValue: category.name,
                          })}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
            {errors.categoryId && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.categoryId.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <FormField
            control={control}
            name={"installDate"}
            label={t("Installed date")}
            type={"date"}
            isRequired={true}
            error={errors.installDate?.message}
          />
          <FormField
            control={control}
            name={"installKm"}
            label={t("bike_mileage_at_install")}
            placeholder={"1000"}
            endText={"km"}
            type={"numeric"}
          />
        </VStack>
      </ScrollView>
      <View style={styles.buttonsWrapper}>
        <Button
          size="lg"
          onPress={handleSubmit(onSubmit)}
          style={styles.deleteButton}
        >
          <ButtonText style={styles.deleteText}>
            {isUpdate ? t("Update") : t("Create")}
          </ButtonText>
        </Button>
        <Button
          variant="outline"
          size="lg"
          onPress={onCancel}
          style={styles.cancelButton}
        >
          <ButtonText>{t("Cancel")}</ButtonText>
        </Button>
      </View>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  form: {
    margin: 25,
  },
  addTo: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.semibold,
  },
  bikeName: {
    color: theme.colors.primaryLight,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
  },
  labelText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
    fontSize: theme.typography.sizes.md,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#2d333a",
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#22b383",
  },
  chipText: {
    color: "white",
  },
  dateInputWrapper: {
    position: "relative",
  },
  buttonsWrapper: {
    gap: 12,
    padding: 16,
  },
  cancelButton: {
    borderRadius: 20,
  },
  deleteButton: {
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  deleteText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
});
