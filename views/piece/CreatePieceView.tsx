import { StyleSheet, Text, View } from "react-native";
import { Box } from "@/components/ui/box";
import { theme } from "@/constants/theme";
import CreatePieceForm from "@/components/forms/CreatePieceForm";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";

type Props = NativeStackScreenProps<BikesStackParamList, "CreatePiece">;

export const CreatePieceView = ({ navigation, route }: Props) => {
  const { bikeId, bikeName } = route.params;

  const onPieceCreated = () => {
    navigation.navigate("BikeDetail", { bikeId, refresh: true } as any);
  };

  const onCancel = () => {
    navigation.goBack();
  };

  return (
    <Box style={styles.container}>
      <CreatePieceForm
        bikeId={bikeId}
        bikeName={bikeName}
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
