import { NativeStackScreenProps } from "expo-router/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import { View } from "react-native";
import { CreateHistoryEntryForm } from "@/components/forms/CreateHistoryEntryForm";
import {
  CREATE_HISTORY_ENTRY,
  UPDATE_HISTORY_ENTRY,
} from "@/constants/tabNames";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props =
  | NativeStackScreenProps<PieceStackParamList, typeof CREATE_HISTORY_ENTRY>
  | NativeStackScreenProps<PieceStackParamList, typeof UPDATE_HISTORY_ENTRY>;

export const CreateHistoryEntryView = ({ navigation, route }: Props) => {
  const styles = useStyles();
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
    <View style={styles.container}>
      <CreateHistoryEntryForm
        piece={pieceWithDetails}
        historyEntry={historyEntry}
        onSuccess={onHistoryAdded}
        onCancel={onCancel}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
}));
