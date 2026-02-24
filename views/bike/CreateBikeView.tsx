import { StyleSheet, View } from "react-native";
import CreateBikeForm from "@/components/forms/CreateBikeForm";
import { theme } from "@/constants/theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { useBikeContext } from "@/context/BikeContext";

type Props = NativeStackScreenProps<BikesStackParamList, "CreateBike">;

export default function CreateBikeView({ navigation }: Props) {
  const { refreshBikes } = useBikeContext();
  const onBikeCreated = async () => {
    await refreshBikes();
    navigation.navigate("BikeList", { refresh: true } as any);
  };

  return (
    <View style={styles.safe}>
      <CreateBikeForm onSuccess={onBikeCreated} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
});
