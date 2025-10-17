import {View, StyleSheet} from 'react-native';
import {Stack, Link} from "expo-router";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{title: "Not Found"}}/>
      <View style={styles.container}>
        <Link href="/+not-found" style={styles.button}>
          Go to Home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
})