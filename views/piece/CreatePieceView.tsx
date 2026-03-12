import { StyleSheet } from "react-native";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import CreatePieceForm from "@/components/forms/CreatePieceForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";

type Props =
  | NativeStackScreenProps<PieceStackParamList, "CreatePiece">
  | NativeStackScreenProps<PieceStackParamList, "UpdatePiece">;

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
