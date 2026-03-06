import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { StyleSheet, View } from "react-native";
import { HistoryCard } from "@/components/history/HistoryCard";

export const PieceHistory = ({
  pieceHistory,
}: {
  pieceHistory: MaintenanceHistoryWithType[];
}) => {
  return (
    <View style={styles.historyContainer}>
      {pieceHistory.map((pieceHistory) => (
        <HistoryCard key={pieceHistory.id} historyEntry={pieceHistory} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: { paddingLeft: 10, paddingRight: 10 },
});
