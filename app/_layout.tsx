import "../i18n";
import { Stack } from "expo-router";
import { DatabaseProvider } from "@/context/DatabaseContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { theme } from "@/constants/theme";
import { StatusBar } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.setOptions({
  duration: 1000,
});

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <DatabaseProvider>
        <KeyboardProvider>
          <StatusBar hidden={true} />
          <Stack
            initialRouteName={"bikes"}
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen name="bikes" />
          </Stack>
        </KeyboardProvider>
      </DatabaseProvider>
    </GluestackUIProvider>
  );
}
