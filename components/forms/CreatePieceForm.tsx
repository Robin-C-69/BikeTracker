import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { useDatabase } from "@/context/DatabaseContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { PieceCategoryRepository } from "@/database/repositories/PieceCategoryRepository";
import { Category } from "@/database/models/PieceCategoryModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreatePiece, PieceWithDetails } from "@/database/models/PieceModel";
import FormField from "@/components/forms/fields/FormField";
import { useTranslation } from "react-i18next";
import { usePieceMutations } from "@/hooks/usePieceMutations";
import { NotificationBar } from "@/components/common/NotificationBar";
import { makeStyles, useTheme } from "@/hooks/useThemedStyles";
import ChipField from "@/components/forms/fields/ChipField";
import Button from "@/components/common/Button";

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
  const styles = useStyles();
  const theme = useTheme();
  const { db } = useDatabase();
  const { createPiece, updatePiece } = usePieceMutations();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const isUpdate = !!piece;

  const formSchema = z.object({
    name: z.string().min(1, t("Name is required")),
    categoryId: z.number({ error: t("Category is required") }).int(),
    description: z.string().optional(),
    installDate: z.string().optional(),
    installKm: z.number().int().min(0, t("mileage_hint")).optional(),
  });

  const { control, handleSubmit } = useForm({
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
        await updatePiece(bikeId, piece.id, pieceData);
      } else {
        await createPiece(bikeId, pieceData);
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
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
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
          />
          <FormField
            control={control}
            name={"description"}
            label={t("Description")}
            placeholder={t("Description")}
          />
          <ChipField
            control={control}
            name={"categoryId"}
            label={t("Category")}
            isRequired={true}
            options={categories.map((category) => ({
              value: category.id,
              label: t(`categories.${category.name}`, {
                defaultValue: category.name,
              }),
            }))}
          />
          <FormField
            control={control}
            name={"installDate"}
            label={t("Installed date")}
            type={"date"}
          />
          <FormField
            control={control}
            name={"installKm"}
            label={t("bike_mileage_at_install")}
            placeholder={"Eg: 0, 1500, 30000..."}
            endText={"km"}
            type={"numeric"}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonsWrapper}>
        <Button
          title={isUpdate ? t("Update") : t("Create")}
          onPress={handleSubmit(onSubmit)}
        />
        <Button title={t("Cancel")} variant="outline" onPress={onCancel} />
      </View>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  form: { margin: 25, gap: theme.spacing(2) },
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
  buttonsWrapper: { gap: 12, padding: 16 },
}));