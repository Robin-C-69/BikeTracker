import { StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import CreatePieceForm from "@/components/forms/CreatePieceForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import { CREATE_PIECE, UPDATE_PIECE } from "@/constants/tabNames";

type Props =
  | NativeStackScreenProps<PieceStackParamList, typeof CREATE_PIECE>
  | NativeStackScreenProps<PieceStackParamList, typeof UPDATE_PIECE>;

export const CreatePieceView = ({ navigation, route }: Props) => {
  const { bikeId, bikeName } = route.params;

  const isPiecePresent = route.params && "piece" in route.params;
  const piece = isPiecePresent ? route.params.piece : undefined;

  const onPieceCreated = async () => {
    navigation.goBack();
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <Box style={styles.container}>
      <CreatePieceForm
        bikeId={bikeId}
        bikeName={bikeName}
        piece={piece}
        onSuccess={onPieceCreated}
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
