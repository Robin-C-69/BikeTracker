import { StyleSheet, View } from "react-native";
import { HistoryCard } from "@/components/history/HistoryCard";
import { UPDATE_HISTORY_ENTRY } from "@/constants/tabNames";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";

export const PieceHistory = ({
  piece,
  history,
  navigation,
}: {
  piece: PieceWithDetails;
  history: MaintenanceHistoryWithType[];
  navigation?: any;
}) => {
  const onClick = (historyEntry: MaintenanceHistoryWithType) => {
    if (!navigation) return;
    navigation.navigate(UPDATE_HISTORY_ENTRY, {
      pieceWithDetails: piece,
      historyEntry: historyEntry,
    });
  };

  return (
    <View style={styles.historyContainer}>
      {history.map((pieceHistory) => (
        <HistoryCard
          key={pieceHistory.id}
          historyEntry={pieceHistory}
          onClick={() => {
            onClick(pieceHistory);
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: { paddingLeft: 10, paddingRight: 10 },
});
