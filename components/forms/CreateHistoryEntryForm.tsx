import { useDatabase } from "@/context/DatabaseContext";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@/components/ui/box";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { VStack } from "../ui/vstack";
import FormField from "@/components/forms/fields/FormField";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { useCallback, useEffect, useState } from "react";
import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";
import { MaintenanceTypeRepository } from "@/database/repositories/MaintenanceTypeRepository";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ButtonText } from "@/components/ui/button";
import {
  CreateMaintenanceHistory,
  MaintenanceHistoryWithType,
} from "@/database/models/MaintenanceHistoryModel";
import { useMaintenanceHistory } from "@/hooks/useMaintenanceHistory";
import { NotificationBar } from "@/components/common/NotificationBar";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { initialCategoryMaintenanceLinks } from "@/database/seeds/initialData";
import { DeleteModal } from "@/components/common/DeleteModal";

type Props = {
  piece: PieceWithDetails;
  historyEntry: MaintenanceHistoryWithType | undefined;
  onSuccess: () => void;
  onCancel: () => void;
};

export const CreateHistoryEntryForm = ({
  piece,
  historyEntry,
  onSuccess,
  onCancel,
}: Props) => {
  const { id: pieceId, name: pieceName, categoryId: pieceCategoryId } = piece;
  const { db } = useDatabase();
  const { t } = useTranslation();
  const { createHistoryEntry, updateHistoryEntry, deleteHistoryEntry } =
    useMaintenanceHistory();

  const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isUpdate = !!historyEntry;

  const formSchema = z.object({
    maintenanceTypeId: z.number({ error: "Category is required" }).int(),
    date: z.string(),
    kmAtMaintenance: z.number(),
    notes: z.string().optional(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maintenanceTypeId: historyEntry?.maintenanceTypeId ?? undefined,
      date: historyEntry?.date ?? "",
      kmAtMaintenance: historyEntry?.kmAtMaintenance ?? undefined,
      notes: historyEntry?.notes ?? "",
    },
  });

  const filterTypesForPiece = useCallback(
    (types: MaintenanceType[], pieceCategoryId: number) => {
      const maintenanceLinks = initialCategoryMaintenanceLinks.filter(
        (link) => link.categoryId === pieceCategoryId,
      );
      const linkedTypeIds = maintenanceLinks.map(
        (link) => link.maintenanceTypeId,
      );
      return types.filter((type) => linkedTypeIds.includes(type.id));
    },
    [],
  );

  const validateDate = useCallback(
    (maintenanceDate: any) => {
      return maintenanceDate >= piece.installDate;
    },
    [piece.installDate],
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!db) return;

    const validate = validateDate(data.date);
    if (!validate) return;

    try {
      const historyData: CreateMaintenanceHistory = {
        pieceId: pieceId,
        maintenanceTypeId: data.maintenanceTypeId,
        date: data.date,
        kmAtMaintenance: data.kmAtMaintenance,
        notes: data.notes,
      };
      if (isUpdate) {
        await updateHistoryEntry(historyEntry.id, historyData);
      } else {
        await createHistoryEntry(historyData);
      }
      onSuccess?.();
    } catch (e) {
      Alert.alert("Error", "Failed to add history entry");
    }
  };

  const onDelete = useCallback(
    async (id: number) => {
      await deleteHistoryEntry(pieceId, id);
      setShowDeleteModal(false);
      onSuccess?.();
    },
    [deleteHistoryEntry, onSuccess, pieceId],
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!db) return;
        const typeRepo = new MaintenanceTypeRepository(db);
        const typeData = await typeRepo.findAll();
        const typesForPiece = filterTypesForPiece(typeData, pieceCategoryId);
        setMaintenanceTypes(typesForPiece);
      } catch (e) {
        console.error("Failed to load types or categories", e);
        Alert.alert("Error", "Failed to load types or categories");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [db, filterTypesForPiece, pieceCategoryId]);

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
            <Text style={styles.pieceName}>{pieceName}</Text>
          </NotificationBar>
          <FormControl isRequired={true}>
            <FormControlLabel>
              <FormControlLabelText style={styles.labelText}>
                {t("Maintenance type")}
              </FormControlLabelText>
            </FormControlLabel>
            <Controller
              control={control}
              name={"maintenanceTypeId"}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.chipsContainer}>
                  {maintenanceTypes.map((type) => {
                    const isSelected = value === type.id;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        onPress={() =>
                          onChange(value === type.id ? undefined : type.id)
                        }
                        onBlur={onBlur}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        activeOpacity={1}
                      >
                        <Text style={styles.chipText}>
                          {t(`maintenance_type.${type.name}`, {
                            defaultValue: type.name,
                          })}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            />
            {errors.maintenanceTypeId && (
              <FormControlError>
                <FormControlErrorText>
                  {errors.maintenanceTypeId.message}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>
          <FormField
            control={control}
            name={"date"}
            label={t("Maintenance date")}
            type={"date"}
            isRequired={true}
            error={errors.date?.message}
          />
          <FormField
            control={control}
            name={"kmAtMaintenance"}
            label={t("bike_mileage_at_maintenance")}
            type={"numeric"}
            isRequired={true}
            error={errors.kmAtMaintenance?.message}
            endText={"km"}
          />
          <FormField control={control} name={"notes"} label={t("Notes")} />
        </VStack>
      </ScrollView>
      <View style={styles.buttonsWrapper}>
        <View style={styles.actionButtons}>
          <Button
            size="lg"
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}
          >
            <ButtonText style={styles.saveText}>
              {isUpdate ? t("Update") : t("Create")}
            </ButtonText>
          </Button>
          {isUpdate && (
            <Button
              size="lg"
              onPress={() => setShowDeleteModal(true)}
              style={styles.deleteButton}
            >
              <ButtonText style={styles.deleteText}>{t("Delete")}</ButtonText>
            </Button>
          )}
        </View>
        <Button
          variant="outline"
          size="lg"
          onPress={onCancel}
          style={styles.cancelButton}
        >
          <ButtonText>{t("Cancel")}</ButtonText>
        </Button>
      </View>
      {historyEntry && (
        <DeleteModal
          text={t("delete_history_entry_confirmation")}
          onClick={() => onDelete(historyEntry.id)}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </Box>
  );
};

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
  pieceName: {
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
  buttonsWrapper: {
    gap: 12,
    padding: 16,
  },
  actionButtons: { flexDirection: "row", gap: theme.spacing(1) },
  cancelButton: {
    borderRadius: 20,
  },
  saveButton: {
    flex: 2,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
  },
  saveText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: theme.colors.error,
  },
  deleteText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
});
