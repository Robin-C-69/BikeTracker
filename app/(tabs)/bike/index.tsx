import BikeCard from "@/app/components/bike/BikeCard";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBike } from "@/app/hooks/useBike";
import { theme } from "@/app/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LEFT_INSET = 20; // Valeur de paddingHorizontal dans scrollContent
const RIGHT_INSET = 20; // Valeur de paddingHorizontal dans scrollContent

export default function Index() {
  const router = useRouter();
  const { bikes, loading, error } = useBike();

  const navigateToBikeDetails = (bikeId: number) => {
    router.navigate({ pathname: "/bike/[bikeId]", params: { bikeId } });
  };

  const navigateToCreateBike = () => {
    router.navigate("/bike/create");
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error while loading bikes: {error}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <ScrollView
          horizontal={true}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {bikes.map((bike) => (
            <BikeCard
              key={bike.id}
              name={bike.name}
              onPress={() => navigateToBikeDetails(bike.id)}
            />
          ))}
          <BikeCard
            name={"Add bike"}
            image={<Ionicons name={"add-outline"} />}
            onPress={navigateToCreateBike}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
});
