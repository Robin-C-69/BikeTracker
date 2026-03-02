import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BikeListView from "@/views/bike/BikeListView";
import BikeDetailView from "@/views/bike/BikeDetailView";
import CreateBikeView from "@/views/bike/CreateBikeView";
import { CreatePieceView } from "@/views/piece/CreatePieceView";
import { theme } from "@/constants/theme";
import CustomHeader from "@/components/common/CustomHeader";
import { useTranslation } from "react-i18next";
import { BikeProvider } from "@/context/BikeContext";
import { Bike } from "@/database/models/BikeModel";

export type BikesStackParamList = {
  BikeList: undefined;
  BikeDetail: { bikeId: number };
  CreateBike: undefined;
  UpdateBike: { bike: Bike };
  CreatePiece: { bikeId: number; bikeName?: string };
};

const Stack = createNativeStackNavigator<BikesStackParamList>();

export default function BikesNavigator() {
  const { t } = useTranslation();
  return (
    <BikeProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="BikeList"
          component={BikeListView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BikeDetail"
          component={BikeDetailView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateBike"
          component={CreateBikeView}
          options={{
            headerShown: true,
            header: () => (
              <CustomHeader
                title={t("New bike")}
                subtitle={t("Add your bike to BikeTracker")}
              />
            ),
          }}
        />
        <Stack.Screen
          name="UpdateBike"
          component={CreateBikeView}
          options={{
            headerShown: true,
            header: () => <CustomHeader title={t("Update bike")} />,
          }}
        />
        <Stack.Screen
          name="CreatePiece"
          component={CreatePieceView}
          options={{
            headerShown: true,
            header: () => <CustomHeader title={t("New piece")} />,
          }}
        />
      </Stack.Navigator>
    </BikeProvider>
  );
}
