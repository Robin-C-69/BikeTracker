import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CreatePieceView } from "@/views/piece/CreatePieceView";
import CustomHeader from "@/components/common/CustomHeader";
import { PieceDetailsView } from "@/views/piece/PieceDetailsView";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { CreateHistoryEntryView } from "@/views/history/CreateHistoryEntryView";

export type PieceStackParamList = {
  CreatePiece: { bikeId: number; bikeName?: string };
  PieceDetails: { piece: PieceWithDetails; bikeName?: string };
  UpdatePiece: { bikeId: number; bikeName?: string; piece: PieceWithDetails };
  CreateHistoryEntry: { pieceWithDetails: PieceWithDetails };
};

const Stack = createNativeStackNavigator<PieceStackParamList>();

export default function PieceNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CreatePiece"
        component={CreatePieceView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("New piece")} />,
        }}
      />
      <Stack.Screen
        name="PieceDetails"
        component={PieceDetailsView}
        options={({ route }) => ({
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t("Piece details")}
              subtitle={route.params.bikeName}
            />
          ),
        })}
      />
      <Stack.Screen
        name="UpdatePiece"
        component={CreatePieceView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("Update piece")} />,
        }}
      />
      <Stack.Screen
        name="CreateHistoryEntry"
        component={CreateHistoryEntryView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("Add a maintenance")} />,
        }}
      />
    </Stack.Navigator>
  );
}
