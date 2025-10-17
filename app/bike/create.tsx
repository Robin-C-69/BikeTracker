import {StyleSheet, Text, View} from "react-native";
import {theme} from "@/client/constants/theme";
import CustomHeader from "@/client/components/common/CustomHeader";

export default function CreateBikePage() {
  return (<View style={styles.container}>
    <CustomHeader/>
    <Text>Create Bike Details</Text>
  </View>)
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  }
})