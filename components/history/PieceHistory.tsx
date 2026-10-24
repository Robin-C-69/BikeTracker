import { View } from "react-native";
import { HistoryCard } from "@/components/history/HistoryCard";
import { UPDATE_HISTORY_ENTRY } from "@/constants/tabNames";
import { PieceWithDetails } from "@/database/models/PieceModel";
import { MaintenanceHistoryWithType } from "@/database/models/MaintenanceHistoryModel";
import { makeStyles } from "@/hooks/useThemedStyles";

export const PieceHistory = ({
  piece,
  history,
  navigation,
}: {
  piece: PieceWithDetails;
  history: MaintenanceHistoryWithType[];
  navigation?: any;
}) => {
  const styles = useStyles();
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

const useStyles = makeStyles(() => ({
  historyContainer: { paddingLeft: 10, paddingRight: 10 },
}));
