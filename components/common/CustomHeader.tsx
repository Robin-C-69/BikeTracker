import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import Logo from "@/app/assets/images/logo.png";
import { useRouter } from "expo-router";

interface CustomHeaderProps {
  title?: string;
  actionButton?: () => void;
  actionButtonName?: keyof typeof Ionicons.glyphMap;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

export default function CustomHeader({
  title,
  actionButton,
  actionButtonName,
  showBackButton = true,
  onBackButtonClick,
}: CustomHeaderProps) {
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
          <TouchableOpacity onPress={navigateBack} accessibilityLabel="Go Back">
            <Ionicons
              name={"chevron-back"}
              size={24}
              style={styles.backButton}
            />
          </TouchableOpacity>
        )}
        <Image
          source={Logo}
          alt="BikeTracker Logo"
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionButton && (
        <TouchableOpacity
          onPress={actionButton}
          style={styles.actionButton}
          accessibilityLabel="Action Button"
        >
          <Ionicons name={actionButtonName} style={styles.actionIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

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
    color: theme.colors.primary,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionIcon: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.xl,
  },
  backButton: {
    marginRight: 8,
    color: "white",
  },
});
