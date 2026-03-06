import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import BikeCard from "@/components/bike/BikeCard";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Fab, FabIcon } from "@/components/ui/fab";
import { useBikeContext } from "@/context/BikeContext";

type Props = NativeStackScreenProps<BikesStackParamList, "BikeList">;

export const AddIconComponent = () => <Ionicons name="add" />;

export default function BikeListView({ navigation }: Props) {
  const { bikes, loading, error } = useBikeContext();

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BikeTracker</Text>
        <Text style={styles.subTitle}>Suivez le cycle de vie de vos vélos</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onPress={() =>
              navigation.navigate("BikeDetail", { bikeId: bike.id })
            }
          />
        ))}
      </ScrollView>

      <Fab style={styles.fab} onPress={() => navigation.navigate("CreateBike")}>
        <FabIcon as={AddIconComponent} />
      </Fab>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderBottomColor: "#2d333a",
    borderWidth: 1,
  },
  title: {
    color: theme.colors.text.lighting,
    fontSize: 26,
    marginBottom: theme.spacing(0.5),
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 15,
    color: theme.colors.text.tertiary,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loading: {
    justifyContent: "center",
  },
  error: {
    color: theme.colors.error,
    textAlign: "center",
    marginTop: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: theme.colors.primary,
    height: 50,
    width: 50,
  },
});
