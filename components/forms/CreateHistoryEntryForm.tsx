import { useDatabase } from "@/context/DatabaseContext";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import FormField from "@/components/forms/fields/FormField";
import { useCallback, useEffect, useState } from "react";
import { MaintenanceType } from "@/database/models/MaintenanceTypeModel";
import { MaintenanceTypeRepository } from "@/database/repositories/MaintenanceTypeRepository";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CreateMaintenanceHistory,
  MaintenanceHistoryWithType,
} from "@/database/models/MaintenanceHistoryModel";
import { useMaintenanceHistory } from "@/hooks/useMaintenanceHistory";
import { NotificationBar } from "@/components/common/NotificationBar";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { initialCategoryMaintenanceLinks } from "@/database/seeds/initialData";
import { DeleteModal } from "@/components/common/DeleteModal";
import ChipField from "@/components/forms/fields/ChipField";
import Button from "@/components/common/Button";
import { makeStyles } from "@/hooks/useThemedStyles";

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
  const styles = useStyles();
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
    maintenanceTypeId: z.number({ error: t("Category is required") }).int(),
    date: z.string().min(1, t("date_required")),
    kmAtMaintenance: z.number({ error: t("mileage_required") }),
    notes: z.string().optional(),
  });

  const { control, handleSubmit, setError } = useForm({
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
    (maintenanceDate: any) =>
      !piece.installDate || maintenanceDate >= piece.installDate,
    [piece.installDate],
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!db) return;

    if (!validateDate(data.date)) {
      setError("date", {
        type: "validate",
        message: t("date_before_install_date"),
      });
      return;
    }

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
      Alert.alert("Error", `Failed to add history entry: ${e}`);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <NotificationBar type="success">
            <Text style={styles.addTo}>{t("Add to")}</Text>
            <Text style={styles.pieceName}>{pieceName}</Text>
          </NotificationBar>
          <ChipField
            control={control}
            name={"maintenanceTypeId"}
            label={t("Maintenance type")}
            isRequired={true}
            options={maintenanceTypes.map((type) => ({
              value: type.id,
              label: t(`maintenance_type.${type.name}`, {
                defaultValue: type.name,
              }),
            }))}
          />
          <FormField
            control={control}
            name={"date"}
            label={t("Maintenance date")}
            type={"date"}
            isRequired={true}
          />
          <FormField
            control={control}
            name={"kmAtMaintenance"}
            label={t("bike_mileage_at_maintenance")}
            type={"numeric"}
            isRequired={true}
            placeholder={"Eg: 0, 1500, 30000..."}
            endText={"km"}
          />
          <FormField control={control} name={"notes"} label={t("Notes")} />
        </View>
      </ScrollView>
      <View style={styles.buttonsWrapper}>
        <View style={styles.actionButtons}>
          <Button
            title={isUpdate ? t("Update") : t("Create")}
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}
          />
          {isUpdate && (
            <Button
              title={t("Delete")}
              variant="danger"
              onPress={() => setShowDeleteModal(true)}
              style={styles.deleteButton}
            />
          )}
        </View>
        <Button title={t("Cancel")} variant="outline" onPress={onCancel} />
      </View>
      {historyEntry && (
        <DeleteModal
          text={t("delete_history_entry_confirmation")}
          onClick={() => onDelete(historyEntry.id)}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  form: { margin: 25, gap: theme.spacing(2) },
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
  buttonsWrapper: { gap: 12, padding: 16 },
  actionButtons: { flexDirection: "row", gap: theme.spacing(1) },
  saveButton: { flex: 2 },
  deleteButton: { flex: 1 },
}));
