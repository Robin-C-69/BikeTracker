import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BikeListView from "@/views/bike/BikeListView";
import BikeDetailView from "@/views/bike/BikeDetailView";
import CreateBikeView from "@/views/bike/CreateBikeView";
import { CreatePieceView } from "@/views/piece/CreatePieceView";
import { theme } from "@/constants/theme";
import CustomHeader from "@/components/common/CustomHeader";

export type BikesStackParamList = {
  BikeList: undefined;
  BikeDetail: { bikeId: number };
  CreateBike: undefined;
  CreatePiece: { bikeId: number };
};

const Stack = createNativeStackNavigator<BikesStackParamList>();

export default function BikesNavigator() {
  return (
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
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Bike Details" showBackButton={true} />
          ),
        }}
      />
      <Stack.Screen
        name="CreateBike"
        component={CreateBikeView}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Add new bike" showBackButton={true} />
          ),
        }}
      />
      <Stack.Screen
        name="CreatePiece"
        component={CreatePieceView}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader title="Add bike piece" showBackButton={true} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
