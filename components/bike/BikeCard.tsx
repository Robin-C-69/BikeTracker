import ImageViewer from "@/components/common/ImageViewer";
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ReactNode, useCallback } from "react";
import { Bike } from "@/database/models/BikeModel";
import { Divider } from "@/components/common/Divider";
import { theme } from "@/constants/theme";
import { usePiecesByBike } from "@/hooks/usePiecesByBike";
import { useTranslation } from "react-i18next";

const PlaceholderImage = require("@/assets/images/bike_icon.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface BikeCardProps {
  bike: Bike;
  image?: ImageSourcePropType | ReactNode;
  onPress?: () => void;
}

export default function BikeCard({ bike, image, onPress }: BikeCardProps) {
  const { t } = useTranslation();
  const { pieces } = usePiecesByBike(bike.id);

  const isReactElement = image && typeof image === "object" && "type" in image;

  const brandAndModel = useCallback((bike: Bike) => {
    if (bike.brand && bike.model) {
      return `${bike.brand}• ${bike.model}`;
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
      {isReactElement ? (
        <View style={styles.image}>{image}</View>
      ) : (
        <ImageViewer
          imgSource={(image as ImageSourcePropType) ?? PlaceholderImage}
          style={styles.image}
        />
      )}
      <View style={styles.nameBanner}>
        <Text style={styles.name}>{bike.name}</Text>
        <Text style={styles.modelBrand}>{brandAndModel(bike)}</Text>
      </View>
      <Divider style={styles.divider} />
      <View style={styles.detailsBanner}>
        <View>
          <Text style={styles.detailsValue}>{bike.totalKm}</Text>
          <Text style={styles.detailsName}>km parcourus</Text>
        </View>
        <View>
          <Text style={styles.detailsValue}>{pieces.length}</Text>
          <Text style={styles.detailsName}>{t("Pieces")}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceVariant,
    overflow: "hidden",
  },
  image: {
    flex: 4,
    marginBottom: 10,
  },
  nameBanner: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    marginLeft: 10,
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
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  detailsValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.lighting,
  },
  detailsName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
});
