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
import { useBike } from "@/hooks/useBike";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Fab, FabIcon } from "@/components/ui/fab";

type Props = NativeStackScreenProps<BikesStackParamList, "BikeList">;

export const AddIconComponent = () => <Ionicons name="add" />;

export default function BikeListView({ navigation }: Props) {
  const { bikes, loading, error } = useBike();

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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            name={bike.name}
            onPress={() =>
              navigation.navigate("BikeDetail", { bikeId: bike.id })
            }
          />
        ))}
        <BikeCard
          name="Add bike"
          image={<Ionicons name="add-outline" />}
          onPress={() => navigation.navigate("CreateBike")}
        />
      </ScrollView>

      <Fab
        size="lg"
        style={styles.fab}
        onPress={() => navigation.navigate("CreateBike")}
      >
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
  },
});
