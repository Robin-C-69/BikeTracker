import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useNavigation } from "expo-router";

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  visible?: boolean;
}

interface CustomHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  actionButton?: ActionButtonProps;
  children?: React.ReactNode;
}

export default function CustomHeader({
  title,
  subtitle,
  onBackButtonClick,
  children,
  actionButton,
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
      {children ?? (
        <View style={styles.wrapper}>
          <TouchableOpacity onPress={navigateBack} accessibilityLabel="Go Back">
            <Ionicons
              name={"arrow-back-outline"}
              size={20}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <View>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      )}
      {actionButton && actionButton.visible && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={actionButton.onPress}
        >
          <Text style={styles.actionButtonText}>{actionButton.label}</Text>
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
    padding: theme.spacing(2),
    paddingTop: 30,
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.border.default,
    borderWidth: 1,
    gap: 10,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
    color: theme.colors.text.secondary,
    verticalAlign: "middle",
  },
  actionButton: {
    paddingVertical: theme.spacing(0.5),
    paddingHorizontal: theme.spacing(2),
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
  },
  actionButtonText: {
    color: theme.colors.text.lighting,
    fontSize: theme.typography.sizes.md,
  },
});
