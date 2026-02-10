import { Stack } from "expo-router";
import CustomHeader from "@/components/common/CustomHeader";

export default function BikeStackLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{ header: () => <CustomHeader /> }}
      />
      <Stack.Screen
        name="[bikeId]"
        options={{
          header: () => {
            return <CustomHeader />;
          },
        }}
      />
      <Stack.Screen name="update" />
    </Stack>
  );
}
