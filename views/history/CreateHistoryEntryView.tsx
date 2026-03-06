import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import { StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { CreateHistoryEntryForm } from "@/components/forms/CreateHistoryEntryForm";
import { theme } from "@/constants/theme";

type Props = NativeStackScreenProps<PieceStackParamList, "CreateHistoryEntry">;

export const CreateHistoryEntryView = ({ navigation, route }: Props) => {
  const { pieceId, pieceName } = route.params;

  const onHistoryAdded = () => {
    navigation.goBack();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <Box style={styles.container}>
      <CreateHistoryEntryForm
        pieceId={pieceId}
        pieceName={pieceName}
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
