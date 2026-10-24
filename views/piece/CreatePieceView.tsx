import { StyleSheet, View } from "react-native";
import { theme } from "@/constants/theme";
import CreatePieceForm from "@/components/forms/CreatePieceForm";
import { NativeStackScreenProps } from "expo-router/native-stack";
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
});
