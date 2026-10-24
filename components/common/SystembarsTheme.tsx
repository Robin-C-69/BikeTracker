import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationBar } from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useTheme } from "@/hooks/useThemedStyles";

// Render once in the root layout, inside the navigation tree.
//
// With Android edge-to-edge the status bar and navigation bar are transparent:
// their "color" is whatever your app draws behind them. So this component
//  1. paints the root/window background with the theme background, and
//  2. picks light or dark icons/buttons so they stay readable on it.
export default function SystemBarsTheme() {
  const theme = useTheme();
  const isDark = useColorScheme() !== "light";
  const barStyle = isDark ? "light" : "dark"; // "light" = white icons/buttons

  useEffect(() => {
    // Root view background: shows behind both bars, during transitions,
    // keyboard animations and overscroll.
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  return (
    <>
      <StatusBar style={barStyle} />
      {Platform.OS === "android" && <NavigationBar style={barStyle} />}
    </>
  );
}
