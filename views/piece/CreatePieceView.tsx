import { View } from "react-native";
import CreatePieceForm from "@/components/forms/CreatePieceForm";
import { NativeStackScreenProps } from "expo-router/native-stack";
import { PieceStackParamList } from "@/navigators/PieceNavigator";
import { CREATE_PIECE, UPDATE_PIECE } from "@/constants/tabNames";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props =
  | NativeStackScreenProps<PieceStackParamList, typeof CREATE_PIECE>
  | NativeStackScreenProps<PieceStackParamList, typeof UPDATE_PIECE>;

export const CreatePieceView = ({ navigation, route }: Props) => {
  const styles = useStyles();
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
    <View style={styles.container}>
      <CreatePieceForm
        bikeId={bikeId}
        bikeName={bikeName}
        piece={piece}
        onSuccess={onPieceCreated}
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
