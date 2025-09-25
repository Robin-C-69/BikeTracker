import BikeCard from "@/components/bike/BikeCard";
import Header from "@/components/common/Header";
import { StyleSheet, View } from "react-native";

export default function BikeSelection() {
  return (
    <View style={styles.container}>
      <Header />
      <BikeCard />
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
