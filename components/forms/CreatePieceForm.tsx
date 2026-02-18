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
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CreatePiece } from "@/database/models/PieceModel";
import { PieceRepository } from "@/database/repositories/PieceRepository";
import { Button, ButtonText } from "@/components/ui/button";

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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState<Date>(new Date());

  const {
    control,
    handleSubmit,
    watch,
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

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB");
  };

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
        <FormControl isRequired={true}>
          <FormControlLabel>
            <FormControlLabelText>Nom</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name={"name"}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input variant="outline" size="md">
                <InputField
                  type="text"
                  placeholder="Nom"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>
            )}
          />
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name={"description"}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input variant="outline" size="md">
                <InputField
                  type="text"
                  placeholder="Description"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </Input>
            )}
          />
        </FormControl>
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
                      activeOpacity={0.7}
                    >
                      <Text>{category.name}</Text>
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
        <FormControl isRequired={true} isInvalid={!!errors.installDate}>
          <FormControlLabel>
            <FormControlLabelText>
              Date d&apos;installation
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name="installDate"
            render={({ field: { onChange, value } }) => (
              <>
                {/* Wrapper with position: relative */}
                <View style={{ position: "relative" }}>
                  <Input isReadOnly>
                    <InputField
                      value={formatDate(value ?? "")}
                      editable={false}
                      placeholder="Sélectionner une date"
                    />
                    <InputSlot>
                      <InputIcon>
                        <Ionicons name="calendar-outline" size={20} />
                      </InputIcon>
                    </InputSlot>
                  </Input>

                  {/* Transparent overlay on top — this captures ALL touches */}
                  <TouchableOpacity
                    style={StyleSheet.absoluteFillObject}
                    onPress={() => setIsDatePickerOpen(true)}
                    activeOpacity={1}
                  />
                </View>

                {/* Use inline picker if modal crashes, or modal if you fix the ref issue */}
                {isDatePickerOpen && (
                  <DateTimePicker
                    value={pickerDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setIsDatePickerOpen(false);
                      if (selectedDate) {
                        setPickerDate(selectedDate);
                        onChange(selectedDate.toISOString());
                      }
                    }}
                  />
                )}
              </>
            )}
          />
          <FormControlError>
            <FormControlErrorText>
              {errors.installDate?.message ?? "La date est obligatoire"}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>
              Km du vélo l&apos;installation
            </FormControlLabelText>
          </FormControlLabel>
          <Controller
            control={control}
            name={"installKm"}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input variant="outline" size="md">
                <InputField
                  type="text"
                  keyboardType="number-pad"
                  placeholder="1000"
                  value={value?.toString() ?? ""}
                  onChangeText={(text) => {
                    // Convert string to number or null
                    const cleaned = text.replace(/[^0-9]/g, "");
                    onChange(cleaned === "" ? null : parseInt(cleaned, 10));
                  }}
                  onBlur={onBlur}
                />
              </Input>
            )}
          />
        </FormControl>
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
  dateInputWrapper: {
    position: "relative",
  },
});
