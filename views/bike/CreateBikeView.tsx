import { View } from "react-native";
import CreateBikeForm from "@/components/forms/CreateBikeForm";
import { NativeStackScreenProps } from "expo-router/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import { CREATE_BIKE, UPDATE_BIKE } from "@/constants/tabNames";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props =
  | NativeStackScreenProps<BikesStackParamList, typeof CREATE_BIKE>
  | NativeStackScreenProps<BikesStackParamList, typeof UPDATE_BIKE>;

export default function CreateBikeView({ navigation, route }: Props) {
  const styles = useStyles();
  const isBikePresent = route.params && "bike" in route.params;
  const bike = isBikePresent ? route.params.bike : undefined;

  const onBikeCreated = async () => {
    navigation.goBack();
  };

  return (
    <View style={styles.safe}>
      <CreateBikeForm onSuccess={onBikeCreated} bike={bike} />
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  safe: { flex: 1, backgroundColor: theme.colors.background },
}));
