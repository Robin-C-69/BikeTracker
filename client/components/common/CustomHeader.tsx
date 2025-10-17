import React from "react";
import {View, TouchableOpacity, StyleSheet} from "react-native";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "@/client/constants/theme";
import Logo from "@/client/assets/images/logo.png";
import {useRouter} from "expo-router";

export default function CustomHeader() {
  const router = useRouter();
  const navigateToAddBike = () => {
    router.navigate({pathname: "/bike/create"})
  }

  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={Logo}
          alt="BikeTracker Logo"
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Add Bike Button */}
      <TouchableOpacity
        onPress={navigateToAddBike}
        style={styles.button}
        accessibilityLabel="Add Bike"
      >
        <Ionicons name="add"/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(2),
    paddingTop: 30,
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 32,
    width: 32,
    marginRight: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1976d2",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  icon: {
    marginRight: 6,
  },
});