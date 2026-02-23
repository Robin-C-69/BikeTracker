import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useNavigation } from "expo-router";

interface CustomHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
}

export default function CustomHeader({
  title,
  subtitle,
  showBackButton = true,
  onBackButtonClick,
}: CustomHeaderProps) {
  const navigation = useNavigation();

  const navigateBack = () => {
    if (onBackButtonClick) {
      onBackButtonClick();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={navigateBack} accessibilityLabel="Go Back">
        <Ionicons name={"chevron-back"} size={24} style={styles.backButton} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing(2),
    paddingTop: 30,
    backgroundColor: theme.colors.surface,
    borderBottomColor: "#2d333a",
    borderWidth: 1,
    gap: 10,
  },
  textContainer: {
    display: "flex",
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
  },
  subtitle: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    color: theme.colors.primaryLight,
    backgroundColor: "#2d333a",
    borderRadius: 12,
    textAlign: "center",
    lineHeight: 40,
  },
});
