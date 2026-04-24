import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import { StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { CreateHistoryEntryForm } from "@/components/forms/CreateHistoryEntryForm";
import { theme } from "@/constants/theme";
import {
  CREATE_HISTORY_ENTRY,
  UPDATE_HISTORY_ENTRY,
} from "@/constants/tabNames";

type Props =
  | NativeStackScreenProps<PieceStackParamList, typeof CREATE_HISTORY_ENTRY>
  | NativeStackScreenProps<PieceStackParamList, typeof UPDATE_HISTORY_ENTRY>;

export const CreateHistoryEntryView = ({ navigation, route }: Props) => {
  const { pieceWithDetails } = route.params;

  const isHistoryEntryPresent = route.params && "historyEntry" in route.params;
  const historyEntry = isHistoryEntryPresent
    ? route.params.historyEntry
    : undefined;

  const onHistoryAdded = () => {
    navigation.goBack();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <Box style={styles.container}>
      <CreateHistoryEntryForm
        piece={pieceWithDetails}
        historyEntry={historyEntry}
        onSuccess={onHistoryAdded}
        onCancel={onCancel}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
