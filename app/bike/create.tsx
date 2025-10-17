import {StyleSheet, Text, View} from "react-native";
import {theme} from "@/client/constants/theme";

export default function CreateBikePage() {
  return (<View style={styles.container}>
    <Text>Create Bike Details</Text>
  </View>)
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  }
})