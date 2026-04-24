import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { CreatePieceView } from "@/views/piece/CreatePieceView";
import CustomHeader from "@/components/common/CustomHeader";
import { PieceDetailsView } from "@/views/piece/PieceDetailsView";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { CreateHistoryEntryView } from "@/views/history/CreateHistoryEntryView";
import {
  CREATE_HISTORY_ENTRY,
  CREATE_PIECE,
  PIECE_DETAILS,
  UPDATE_HISTORY_ENTRY,
  UPDATE_PIECE,
} from "@/constants/tabNames";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";

export type PieceStackParamList = {
  CreatePiece: { bikeId: number; bikeName?: string };
  PieceDetails: { piece: PieceWithDetails; bikeName?: string };
  UpdatePiece: { bikeId: number; bikeName?: string; piece: PieceWithDetails };
  CreateHistoryEntry: { pieceWithDetails: PieceWithDetails };
  UpdateHistoryEntry: {
    pieceWithDetails: PieceWithDetails;
    historyEntry: MaintenanceHistoryWithType;
  };
};

const Stack = createNativeStackNavigator<PieceStackParamList>();

export default function PieceNavigator() {
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={CREATE_PIECE}
        component={CreatePieceView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("New piece")} />,
        }}
      />
      <Stack.Screen
        name={PIECE_DETAILS}
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
        name={UPDATE_PIECE}
        component={CreatePieceView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("Update piece")} />,
        }}
      />
      <Stack.Screen
        name={CREATE_HISTORY_ENTRY}
        component={CreateHistoryEntryView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("Add a maintenance")} />,
        }}
      />
      <Stack.Screen
        name={UPDATE_HISTORY_ENTRY}
        component={CreateHistoryEntryView}
        options={{
          headerShown: true,
          header: () => <CustomHeader title={t("Update history")} />,
        }}
      />
    </Stack.Navigator>
  );
}
