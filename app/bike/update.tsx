import { StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import CustomHeader from "@/app/components/common/CustomHeader";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { theme } from "@/app/constants/theme";
import { DeleteBikeForm } from "@/app/components/forms/DeleteBikeForm";

export default function UpdateBikePage() {
  const { bikeId } = useLocalSearchParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Stack.Screen
          options={{
            header: () => (
              <CustomHeader
                actionButton={() => setOpenDeleteDialog(true)}
                actionButtonName={"trash-bin"}
              />
            ),
          }}
        />
        <DeleteBikeForm
          key={1}
          bikeId={Number(bikeId)}
          openDeleteDialog={openDeleteDialog}
          setOpenDeleteDialog={setOpenDeleteDialog}
        />
        <View style={styles.centeredView}>
          <Text>UPDATE</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
