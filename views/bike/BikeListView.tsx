import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BikesStackParamList } from "@/navigators/BikesNavigator";
import BikeCard from "@/components/bike/BikeCard";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "@/constants/theme";
import { useBikeContext } from "@/context/BikeContext";
import { BIKE_DETAIL, BIKE_LIST, CREATE_BIKE } from "@/constants/tabNames";
import CustomHeader from "@/components/common/CustomHeader";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<BikesStackParamList, typeof BIKE_LIST>;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function BikeListView({ navigation }: Props) {
  const { bikes, loading, error } = useBikeContext();
  const { t } = useTranslation();

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
      <CustomHeader>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <View>
          <Text style={styles.title}>BikeTracker</Text>
          <Text style={styles.subTitle}>
            {t("Follow your bikes lifecycle")}
          </Text>
        </View>
      </CustomHeader>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bikes.map((bike) => (
          <BikeCard
            key={bike.id}
            bike={bike}
            onPress={() =>
              navigation.navigate(BIKE_DETAIL, { bikeId: bike.id })
            }
          />
        ))}
        <TouchableOpacity
          style={styles.addCard}
          onPress={() => navigation.navigate(CREATE_BIKE)}
        >
          <Ionicons
            name={"add-circle-outline"}
            size={25}
            color={theme.colors.primary}
          />
          <Text style={styles.addCardTitle}>{t("Add a new bike")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  logo: { width: 40, height: 40, marginRight: theme.spacing(1) },
  title: {
    color: theme.colors.primaryLight,
    fontSize: 26,
    marginBottom: theme.spacing(0.5),
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 15,
    color: theme.colors.text.secondary,
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
  addCard: {
    width: "100%",
    height: SCREEN_WIDTH * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    borderColor: theme.colors.border.default,
    borderRadius: theme.spacing(0.5),
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addCardTitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.md,
    marginTop: theme.spacing(0.5),
  },
});
