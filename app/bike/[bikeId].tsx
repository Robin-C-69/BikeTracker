import {StyleSheet, Text, View} from 'react-native';
import {theme} from "@/client/constants/theme";
import {useLocalSearchParams} from "expo-router";

export default function BikeDetails() {
  const {name} = useLocalSearchParams()
  return <View style={styles.container}><Text>Bike Details</Text><Text>For bike: {name}</Text></View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    height: "100%",
  },
});