import ImageViewer from "@/components/common/ImageViewer";
import { useBike } from "@/hooks/useBike";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PlaceholderImage = require("@/assets/images/react-logo.png");

export default function BikeCard() {
  const {
    bikes,
    loading,
    error,
    createBike,
    updateBike,
    deleteBike,
    getAllBikes,
    getBikeById,
    refreshBikes,
    clearError,
  } = useBike();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const showBikeDetails = () => {
    return alert("clicked");
  };

  return (
    <View style={styles.card} onTouchEnd={showBikeDetails}>
      <ImageViewer
        imgSource={PlaceholderImage}
        selectedImage={selectedImage}
        style={styles.image}
      />
      <Text style={styles.nameBanner}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1f23",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    height: "90%",
    borderRadius: 10,
    backgroundColor: "#3b3f46",
    overflow: "hidden",
  },
  image: {
    display: "flex",
    flex: 25,
  },
  nameBanner: {
    display: "flex",
    flex: 1,
    color: "#fff",
    backgroundColor: "black",
    textAlign: "center",
  },
});
