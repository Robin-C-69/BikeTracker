import React from "react";
import {View, TouchableOpacity, StyleSheet} from "react-native";
import {Image} from "expo-image";
import {Ionicons} from "@expo/vector-icons";
import {theme} from "@/client/constants/theme";
import Logo from "@/client/assets/images/logo.png";
import {useRouter} from "expo-router";

interface CustomHeaderProps {
  actionButton?: () => void,
  showBackButton?: boolean
  onBackButtonClick?: () => void,
}

export default function CustomHeader({actionButton, showBackButton = true, onBackButtonClick}: CustomHeaderProps) {
  const router = useRouter();

  const navigateBack = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={navigateBack}
            accessibilityLabel="Go Back"
          >
            <Ionicons name={"chevron-back"} size={24} style={styles.backButton}/>
          </TouchableOpacity>
        )}
        <Image
          source={Logo}
          alt="BikeTracker Logo"
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      {actionButton && <TouchableOpacity
          onPress={actionButton}
          style={styles.actionButton}
          accessibilityLabel="Add Bike"
      >
          <Ionicons name="add"/>
      </TouchableOpacity>}
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
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1976d2",
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backButton: {
    marginRight: 8,
    color: "white",
  },
});