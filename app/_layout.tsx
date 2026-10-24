import "../i18n";
import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import { DatabaseProvider } from "@/context/DatabaseContext";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { loadThemeMode } from "@/constants/themeMode";
import { useTheme } from "@/hooks/useThemedStyles";

loadThemeMode();

SplashScreen.setOptions({
  duration: 1000,
  fade: false,
});

function Navigation() {
  const theme = useTheme();
  return (
    <Stack
      initialRouteName={"bikes"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="bikes" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <KeyboardProvider>
        <StatusBar hidden={true} />
        <Navigation />
      </KeyboardProvider>
    </DatabaseProvider>
  );
}
