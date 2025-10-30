import { Stack, useRouter } from "expo-router";
import CustomHeader from "@/client/components/common/CustomHeader";

export default function BikeStackLayout() {
  const router = useRouter();
  const navigateToUpdate = (bikeId: number) => {
    router.navigate({ pathname: "/bike/update", params: { bikeId } });
  };

  return (
    <Stack>
      <Stack.Screen
        name="create"
        options={{ header: () => <CustomHeader /> }}
      />
      <Stack.Screen
        name="[bikeId]"
        options={{
          header: ({ route }: any) => {
            const bikeId = route.params.bikeId;
            return (
              <CustomHeader
                actionButton={() => navigateToUpdate(bikeId)}
                actionButtonName={"build-outline"}
              />
            );
          },
        }}
      />
      <Stack.Screen name="update" />
    </Stack>
  );
}
