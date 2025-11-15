import React, { useState } from "react";
import { ICreatePieceRequest } from "@/api/models/PieceModel";
import { usePiece } from "@/app/hooks/usePiece";
import {
  AttributeDefinition,
  CATEGORY_SUBCATEGORY_MAP,
  getAllCategories,
  getCategorySubcategories,
  getConditionalGroups,
  getSubcategoryAttributes,
  isSubcategoryInGroup,
  PIECE_STATUSES,
} from "@/app/constants/pieces";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DatePicker from "react-native-date-picker";
import { style } from "dom-helpers";

interface PieceFormData {
  enabled: boolean;
  category: string;
  subcategory: string;
  name: string;
  brand: string;
  model: string;
  status: string;
  attributes: Record<string, any>;
}

interface MultiplePiecesFormProps {
  bikeId: number;
  onSuccess?: (bikeId: number) => void;
  onCancel?: () => void;
  showOnlyEnabled?: boolean;
}

export const CreatePiecesForm: React.FC<MultiplePiecesFormProps> = ({
  bikeId,
  onSuccess,
  onCancel,
  showOnlyEnabled = false,
}) => {
  const [date, setDate] = useState(new Date());
  const { createPiece, loading, error } = usePiece();
  const [errors, setErrors] = React.useState<string[] | null>(null);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());

  // État pour les sélections de groupes conditionnels
  // Format: { categoryName_groupId: selectedSubcategory }
  const [conditionalSelections, setConditionalSelections] = useState<
    Record<string, string>
  >({});

  const initializePiecesData = (): Record<string, PieceFormData> => {
    const piecesData: Record<string, PieceFormData> = {};

    getAllCategories().forEach((category) => {
      const subcategories = getCategorySubcategories(category);
      subcategories.forEach((subcategory) => {
        piecesData[subcategory] = {
          enabled: false,
          category: category,
          subcategory: subcategory,
          name: "",
          brand: "",
          model: "",
          status: PIECE_STATUSES.NEW,
          attributes: {},
        };
      });
    });
    return piecesData;
  };

  const [pieceData, setPieceData] = useState<Record<string, PieceFormData>>(
    initializePiecesData(),
  );

  const enabledCount = Object.values(pieceData).filter((p) => p.enabled).length;

  const togglePieceEnabled = (subcategory: string) => {
    setPieceData((prevData) => ({
      ...prevData,
      [subcategory]: {
        ...prevData[subcategory],
        enabled: !prevData[subcategory].enabled,
      },
    }));
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleConditionalSelection = ({
    category,
    groupId,
    selectedSubcategory,
  }: {
    category: string;
    groupId: string;
    selectedSubcategory: string;
  }) => {
    setConditionalSelections((prev) => ({
      ...prev,
      [`${category}_${groupId}`]: selectedSubcategory,
    }));

    //Deactivate other subcategories in the same group
    const subcategories = getCategorySubcategories(category);

    setPieceData((prev) => {
      const updatedData = { ...prev };
      subcategories.forEach((subcategory) => {
        if (
          isSubcategoryInGroup({ category, subcategory, group: groupId }) &&
          subcategory !== selectedSubcategory
        ) {
          updatedData[subcategory] = {
            ...updatedData[subcategory],
            enabled: false,
          };
        }
      });
      return updatedData;
    });
  };

  const updatePieceField = ({
    subcategory,
    field,
    value,
  }: {
    subcategory: string;
    field: keyof PieceFormData;
    value: any;
  }) => {
    setPieceData((prev) => ({
      ...prev,
      [subcategory]: { ...prev[subcategory], [field]: value },
    }));
  };

  const updatePieceAttribute = ({
    subcategory,
    attributeKey,
    value,
  }: {
    subcategory: string;
    attributeKey: string;
    value: any;
  }) => {
    setPieceData((prev) => ({
      ...prev,
      [subcategory]: {
        ...prev[subcategory],
        attributes: {
          ...prev[subcategory].attributes,
          [attributeKey]: value,
        },
      },
    }));
  };

  const onSubmit = async () => {
    const enabledPieces = Object.values(pieceData).filter(
      (piece) => piece.enabled,
    );
    if (!enabledPieces.length) {
      setErrors(["Please enable at least one piece to create."]);
      return;
    }

    const promises = enabledPieces.map((piece) => {
      const pieceRequest: ICreatePieceRequest = {
        bikeId: bikeId,
        category: piece.category,
        subcategory: piece.subcategory,
        name: piece.name,
        brand: piece.brand,
        model: piece.model,
        status: piece.status,
        attributes: piece.attributes,
      };
      return createPiece(pieceRequest);
    });

    await Promise.all(promises);

    if (onSuccess) {
      onSuccess(bikeId);
    }
  };

  // Render attribute field based on its definition
  const renderAttributeField = ({
    subcategory,
    attributeKey,
    definition,
  }: {
    subcategory: string;
    attributeKey: string;
    definition: AttributeDefinition;
  }) => {
    const value = pieceData[subcategory].attributes[attributeKey];

    switch (definition.type) {
      case "number":
        return (
          <View key={attributeKey} style={styles.attributeInput}>
            <Text style={styles.attributeLabel}>{definition.label}</Text>
            <TextInput
              style={styles.smallInput}
              value={value?.toString() || ""}
              onChangeText={(text) => {
                const numValue = text ? parseFloat(text) : null;
                updatePieceAttribute({
                  subcategory,
                  attributeKey,
                  value: numValue,
                });
              }}
              keyboardType={"numeric"}
              placeholder={definition.placeholder}
            />
          </View>
        );
      case "boolean":
        return (
          <View key={attributeKey} style={styles.attributeInput}>
            <Text style={styles.attributeLabel}>{definition.label}</Text>
            <Switch
              value={value || false}
              onValueChange={(val) =>
                updatePieceAttribute({ subcategory, attributeKey, value: val })
              }
            />
          </View>
        );
      case "select":
        return (
          <View key={attributeKey} style={styles.attributeInput}>
            <Text style={styles.attributeLabel}>{definition.label}</Text>
            <View style={styles.smallPickerContainer}>
              <Picker
                selectedValue={value || ""}
                onValueChange={(value) =>
                  updatePieceAttribute({ subcategory, attributeKey, value })
                }
                style={styles.smallPicker}
              >
                <Picker.Item label={"Select..."} value={""} />
                {definition.options?.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        );
      case "date": //TODO: Date picker implementation
      /*return (
          <View key={attributeKey} style={styles.attributeInput}>
            <Text style={styles.attributeLabel}>{definition.label}</Text>
            <View style={styles.attributeInput}>
              <DatePicker date={date} onDateChange={setDate} mode={"date"} />
            </View>
          </View>
        );*/
      case "string":
      default:
        return (
          <View key={attributeKey} style={styles.attributeInput}>
            <Text style={styles.attributeLabel}>{definition.label}</Text>
            <TextInput
              style={styles.smallInput}
              value={value || ""}
              onChangeText={(text) =>
                updatePieceAttribute({ subcategory, attributeKey, value: text })
              }
              placeholder={definition.placeholder}
            />
          </View>
        );
    }
  };

  //Render basic piece form
  const renderPieceForm = ({
    subcategory,
    pieceData,
  }: {
    subcategory: string;
    pieceData: PieceFormData;
  }) => {
    const subcategoryAttributes = getSubcategoryAttributes(subcategory);

    if (showOnlyEnabled && !pieceData.enabled) {
      return null;
    }

    return (
      <View
        key={subcategory}
        style={[styles.pieceCard, pieceData.enabled && styles.pieceCardEnabled]}
      >
        {/* Header with toggle */}
        <View style={styles.pieceHeader}>
          <View style={styles.pieceHeaderLeft}>
            <Switch
              value={pieceData.enabled}
              onValueChange={() => togglePieceEnabled(subcategory)}
            />
            <Text style={styles.pieceTitle}>{subcategory}</Text>
          </View>
        </View>

        {/* Form fields - only show if enabled */}
        {pieceData.enabled && (
          <View style={styles.pieceContent}>
            {/* Basic fields */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={pieceData.name}
                  onChangeText={(value) =>
                    updatePieceField({ subcategory, field: "name", value })
                  }
                  placeholder="Name"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Brand</Text>
                <TextInput
                  style={styles.input}
                  value={pieceData.brand}
                  onChangeText={(value) =>
                    updatePieceField({ subcategory, field: "brand", value })
                  }
                  placeholder="Brand"
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={pieceData.model}
                  onChangeText={(value) =>
                    updatePieceField({ subcategory, field: "model", value })
                  }
                  placeholder="Model"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.fieldLabel}>Status</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={pieceData.status}
                    onValueChange={(value) =>
                      updatePieceField({ subcategory, field: "status", value })
                    }
                    style={styles.picker}
                  >
                    {Object.values(PIECE_STATUSES).map((status) => (
                      <Picker.Item key={status} label={status} value={status} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Dynamic attributes */}
            {Object.keys(subcategoryAttributes).length && (
              <View style={styles.attributesSection}>
                <Text style={styles.attributesSectionTitle}>
                  Specifications
                </Text>
                <View style={styles.attributesGrid}>
                  {Object.entries(subcategoryAttributes).map(
                    ([key, definition]) =>
                      renderAttributeField({
                        subcategory,
                        attributeKey: key,
                        definition,
                      }),
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderConditionalGroup = ({
    category,
    group,
  }: {
    category: string;
    group: any;
  }) => {
    const key = `${category}_${group.id}`;
    const selectedSubcategory = conditionalSelections[key] || "";

    return (
      <View key={group.id} style={styles.conditionalGroup}>
        <View style={styles.conditionalHeader}>
          <Text style={styles.conditionalTitle}>{group.label}</Text>
          {group.description && (
            <Text style={styles.conditionalDescription}>
              {group.description}
            </Text>
          )}
        </View>

        {/* Selector */}
        <View style={styles.conditionalSelector}>
          <Text style={styles.fieldLabel}>{group.selector.label}</Text>
          <View style={styles.conditionalButtons}>
            {group.selector.options.map((option: any) => {
              const isSelected = selectedSubcategory === option.subcategory;
              const isEnabled = pieceData[option.subcategory]?.enabled;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.conditionalButton,
                    isSelected && styles.conditionalButtonSelected,
                  ]}
                  onPress={() =>
                    handleConditionalSelection({
                      category,
                      groupId: group.id,
                      selectedSubcategory,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.conditionalButtonText,
                      isSelected && styles.conditionalButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isEnabled && (
                    <View style={styles.enabledIndicator}>
                      <Text style={styles.enabledIndicatorText}>⩗</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Render selected subcategory form */}
        {selectedSubcategory &&
          renderPieceForm({
            subcategory: selectedSubcategory,
            pieceData: pieceData[selectedSubcategory],
          })}
      </View>
    );
  };

  const renderCategory = (category: string) => {
    const categoryConfig = CATEGORY_SUBCATEGORY_MAP[category];
    const conditionalGroups = getConditionalGroups(category);
    const isExpanded = expandedCategories.has(category);

    // Get subcategory that are NOT in any conditional group
    const standaloneSubcategories = Object.keys(
      categoryConfig.subcategories,
    ).filter((subcategory) => {
      const subConfig = categoryConfig.subcategories[subcategory];
      return !subConfig.group;
    });

    const enabledCount = Object.keys(categoryConfig.subcategories).filter(
      (sub) => pieceData[sub].enabled,
    ).length;

    if (showOnlyEnabled && !enabledCount) {
      return null;
    }

    return (
      <View key={category} style={styles.categorySection}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => toggleCategoryExpansion(category)}
        >
          <Text style={styles.categoryTitle}>
            {categoryConfig.label}
            {enabledCount > 0 && (
              <Text style={styles.categoryCount}>{enabledCount}</Text>
            )}
          </Text>
          <Text style={styles.categoryToggle}>{isExpanded ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <>
            {/* Render conditional groups */}
            {conditionalGroups.map((group) =>
              renderConditionalGroup({ category, group }),
            )}

            {/* Render standalone subcategories */}
            {standaloneSubcategories.map((subcategory) =>
              renderPieceForm({
                subcategory,
                pieceData: pieceData[subcategory],
              }),
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Bike Components</Text>
          <Text style={styles.subtitle}>
            Select and configure the components for this bike
          </Text>
          {enabledCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {enabledCount} component{enabledCount > 1 ? "s" : ""} selected
              </Text>
            </View>
          )}
        </View>

        {getAllCategories().map((category) => renderCategory(category))}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.spacing} />
      </ScrollView>

      {/* Fixed bottom buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            (loading || enabledCount === 0) && styles.disabledButton,
          ]}
          onPress={onSubmit}
          disabled={loading || enabledCount === 0}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Saving..." : `Save ${enabledCount} Component(s)`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#3498db",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  categorySection: {
    marginTop: 16,
  },
  categoryHeader: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  categoryCount: {
    color: "#3498db",
  },
  categoryToggle: {
    fontSize: 16,
    color: "#666",
  },
  conditionalGroup: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  conditionalHeader: {
    marginBottom: 12,
  },
  conditionalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  conditionalDescription: {
    fontSize: 13,
    color: "#666",
  },
  conditionalSelector: {
    marginBottom: 12,
  },
  conditionalButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  conditionalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 8,
    alignItems: "center",
    position: "relative",
  },
  conditionalButtonSelected: {
    borderColor: "#3498db",
    backgroundColor: "#e3f2fd",
  },
  conditionalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  conditionalButtonTextSelected: {
    color: "#3498db",
    fontWeight: "600",
  },
  enabledIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#4caf50",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  enabledIndicatorText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  pieceCard: {
    backgroundColor: "#fff",
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pieceCardEnabled: {
    borderColor: "#3498db",
    borderWidth: 2,
  },
  pieceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  pieceHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pieceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  pieceContent: {
    padding: 12,
    paddingTop: 0,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  halfInput: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  smallInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 8,
    fontSize: 13,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 42,
  },
  smallPickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  smallPicker: {
    height: 38,
  },
  attributesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  attributesSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  attributesGrid: {
    gap: 8,
  },
  attributeInput: {
    marginBottom: 8,
  },
  attributeLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
    color: "#555",
  },
  attributeSwitch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#3498db",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 14,
  },
  spacing: {
    height: 20,
  },
});
