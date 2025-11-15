import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { theme } from "@/app/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import CreateBikeForm from "@/app/components/forms/CreateBikeForm";
import { CreatePiecesForm } from "@/app/components/forms/CreatePiecesForm";

export default function CreateBikePage() {
  const router = useRouter();
  const [step, setStep] = useState<"bike" | "pieces">("bike");
  const [createdBikeId, setCreatedBikeId] = useState<number | null>(null);

  //Step 1 : Once Bike is created
  const onBikeCreated = (bikeId: number) => {
    setCreatedBikeId(bikeId);
    console.log("Bike created with ID:", bikeId);
    setStep("pieces");
  };

  //Step 2 : Once Pieces are added to Bike
  const navigateToBike = (bikeId: number) => {
    router.navigate({ pathname: "/bike/[bikeId]", params: { bikeId } });
  };

  const onCancel = () => {
    if (step === "pieces" && createdBikeId) {
      // If user cancels on pieces step, ask if they want to continue without pieces
      Alert.alert(
        "Skip Components?",
        "Do you want to skip adding components? You can add them later.",
        [
          {
            text: "Continue configuring",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () =>
              router.navigate({
                pathname: "/bike/[bikeId]",
                params: { bikeId: createdBikeId },
              }),
          },
        ],
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.safe}>
      <View style={styles.progressBar}>
        <View style={styles.progressStep}>
          <View
            style={[
              styles.progressDot,
              step === "bike" && styles.progressDotActive,
            ]}
          >
            <Text style={styles.progressDotText}>1</Text>
          </View>
          <Text
            style={[
              styles.progressLabel,
              step === "bike" && styles.progressLabelActive,
            ]}
          >
            Create Bike
          </Text>
        </View>

        <View style={styles.progressLine} />

        <View style={styles.progressStep}>
          <View
            style={[
              styles.progressDot,
              step === "pieces" && styles.progressDotActive,
            ]}
          >
            <Text style={styles.progressDotText}>2</Text>
          </View>
          <Text
            style={[
              styles.progressLabel,
              step === "pieces" && styles.progressLabelActive,
            ]}
          >
            Add Components
          </Text>
        </View>
      </View>

      {/* Content */}
      {step === "bike" ? (
        <CreateBikeForm onSuccess={onBikeCreated} />
      ) : createdBikeId ? (
        <CreatePiecesForm bikeId={createdBikeId} onSuccess={navigateToBike} />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#fff",
    height: 75,
  },
  progressStep: {
    alignItems: "center",
    height: 50,
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.tabBar.inactive,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  progressDotActive: {
    backgroundColor: theme.colors.secondary,
  },
  progressDotText: {
    color: theme.colors.text,
    fontWeight: "600",
    fontSize: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: theme.colors.tabBar.inactive,
  },
  progressLabelActive: {
    color: theme.colors.secondary,
    fontWeight: "600",
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: theme.colors.tabBar.inactive,
    marginHorizontal: 8,
    marginBottom: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
