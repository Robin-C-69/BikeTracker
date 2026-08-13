import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { useCallback } from "react";
import { Bike } from "@/database/models/BikeModel";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { usePieceCount } from "@/hooks/usePieceCount";

const PlaceholderImage = require("@/assets/images/bike.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface BikeCardProps {
  bike: Bike;
  onPress?: () => void;
}

export default function BikeCard({ bike, onPress }: BikeCardProps) {
  const { t } = useTranslation();
  const pieceCount = usePieceCount(bike.id);

  const brandAndModel = useCallback((bike: Bike) => {
    if (bike.brand && bike.model) {
      return `${bike.brand} • ${bike.model}`;
    } else if (bike.brand) {
      return bike.brand;
    } else if (bike.model) {
      return bike.model;
    } else {
      return "";
    }
  }, []);

  return (
    <View style={styles.card} onTouchEnd={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={bike.imageUri ? { uri: bike.imageUri } : PlaceholderImage}
          style={styles.image}
        />
        <LinearGradient
          style={styles.gradient}
          colors={["transparent", "#12161270", theme.colors.surface]}
        />
      </View>
      <View style={styles.nameBanner}>
        <Text style={styles.name}>{bike.name}</Text>
        {(bike.brand || bike.model) && (
          <Text style={styles.modelBrand}>{brandAndModel(bike)}</Text>
        )}
      </View>
      <View style={styles.detailsBanner}>
        <View>
          <Text style={styles.detailsName}>{t("Traveled distance")}</Text>
          <Text style={styles.detailsValue}>
            {bike.totalKm}
            {t(" km")}
          </Text>
        </View>
        <View>
          <Text style={styles.detailsName}>{t("Pieces")}</Text>
          {/*<Text style={styles.detailsValue}>{pieces.length}</Text>*/}
          <Text style={styles.detailsValue}>{pieceCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.75,
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    borderColor: theme.colors.border.default,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    flex: 4,
    width: "100%",
    marginBottom: 0,
    opacity: 0.6,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: theme.spacing(25),
  },
  nameBanner: {
    textAlign: "center",
    textAlignVertical: "center",
    marginTop: theme.spacing(-7.5),
    marginLeft: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  name: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  modelBrand: {
    display: "flex",
    flexDirection: "row",
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  divider: { width: "95%", alignSelf: "center" },
  detailsBanner: {
    marginBottom: theme.spacing(1.5),
    marginLeft: theme.spacing(1.5),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing(5),
  },
  detailsValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  detailsName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});
