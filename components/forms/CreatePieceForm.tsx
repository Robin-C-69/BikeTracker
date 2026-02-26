import {
  ActivityIndicator,
  Alert,
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
import { CreatePiece } from "@/database/models/PieceModel";
import { PieceRepository } from "@/database/repositories/PieceRepository";
import { Button, ButtonText } from "@/components/ui/button";
import FormField from "@/components/forms/fields/FormField";

type Props = {
  bikeId: number;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function CreatePieceForm({
  bikeId,
  onSuccess,
  onCancel,
}: Props) {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    categoryId: z.number({ error: "Category is required" }).int(),
    description: z.string().optional(),
    installDate: z.string().optional(),
    installKm: z
      .number()
      .int()
      .min(0, "Kilometers cannot be negative")
      .optional()
      .nullable(),
  });

  const { db } = useDatabase();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      categoryId: undefined,
      description: "",
      installDate: "",
      installKm: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting form with data:", data);
    if (!db) {
      Alert.alert("Error", "Database not available");
      return;
    }
    try {
      const pieceData: CreatePiece = {
        bike_id: bikeId,
        name: data.name,
        category_id: data.categoryId,
        description: data.description,
        install_date: data.installDate || undefined,
        install_km: data.installKm || undefined,
      };

      const pieceRepo = new PieceRepository(db);
      await pieceRepo.create(pieceData);
      console.log("Piece created successfully:", pieceData);
      Alert.alert("Success", "Piece created successfully");
      onSuccess && onSuccess();
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
        const categoriesData = await categoryRepo.findAllCategories();

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
      <VStack space="md" style={styles.form}>
        <FormField
          control={control}
          name={"name"}
          label={"Nom"}
          isRequired={true}
          placeholder={"Nom"}
        />
        <FormField
          control={control}
          name={"description"}
          label={"Description"}
          placeholder={"Description"}
        />
        <FormControl isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>Categorie</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name={"categoryId"}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
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
                    >
                      <Text style={styles.chipText}>{category.name}</Text>
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
          label={"Date d'installation"}
          type={"date"}
          isRequired={true}
        />
        <FormField
          control={control}
          name={"installKm"}
          label={"Km du vélo à l'installation"}
          placeholder={"1000"}
          type={"numeric"}
        />
        <View>
          <Button variant="outline" size="lg" onPress={onCancel}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button size="lg" onPress={handleSubmit(onSubmit)}>
            <ButtonText>Create Piece</ButtonText>
          </Button>
        </View>
      </VStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
  form: {
    margin: 25,
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
});
