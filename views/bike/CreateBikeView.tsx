import { StyleSheet, View } from "react-native";
import CreateBikeForm from "@/components/forms/CreateBikeForm";
import { theme } from "@/constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { useBikeContext } from "@/context/BikeContext";

type Props =
  | NativeStackScreenProps<BikesStackParamList, "CreateBike">
  | NativeStackScreenProps<BikesStackParamList, "UpdateBike">;

export default function CreateBikeView({ navigation, route }: Props) {
  const { refreshBikes } = useBikeContext();

  const isBikePresent = route.params && "bike" in route.params;
  const bike = isBikePresent ? route.params.bike : undefined;

  const onBikeCreated = async () => {
    await refreshBikes();
    navigation.goBack();
  };

  return (
    <View style={styles.safe}>
      <CreateBikeForm onSuccess={onBikeCreated} bike={bike} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
});
