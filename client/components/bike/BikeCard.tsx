import ImageViewer from "@/client/components/common/ImageViewer";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageSourcePropType,
  GestureResponderEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { ComponentType, ReactNode } from "react";

const PlaceholderImage = require("@/client/assets/images/bike_icon.png");

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BikeCardProps {
  name: string;
  image?: ImageSourcePropType | ReactNode;
  onPress?: () => void;
}

export default function BikeCard({ name, image, onPress }: BikeCardProps) {
  const isReactElement = image && typeof image === "object" && "type" in image;

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
      <Text style={styles.nameBanner}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.8, // 80% de la largeur de l'écran
    height: SCREEN_HEIGHT * 0.7, // 70% de la hauteur de l'écran
    borderRadius: 10,
    backgroundColor: "#3b3f46",
    overflow: "hidden",
    marginHorizontal: 10, // Espace entre les cartes
  },
  image: {
    flex: 25,
  },
  nameBanner: {
    flex: 1,
    color: "#fff",
    backgroundColor: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
