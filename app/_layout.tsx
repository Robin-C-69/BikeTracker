import { Stack, Tabs } from "expo-router";
import { DatabaseProvider } from "@/context/DatabaseContext";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import CustomHeader from "@/components/common/CustomHeader";

const APP_TITLE = "BikeTracker";

export default function RootLayout() {
  useEffect(() => {
    const setupFullScreen = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
      }
    };
    setupFullScreen();
  }, []);

  return (
    <GluestackUIProvider mode="dark">
      <DatabaseProvider>
        <StatusBar hidden={true} />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primary,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
              headerShown: true,
              header: () => (
                <CustomHeader title={APP_TITLE} showBackButton={false} />
              ),
            }}
          />
          <Tabs.Screen
            name="bikes"
            options={{
              title: "Bikes",
              tabBarIcon: ({ color }) => (
                <Ionicons name="bicycle" size={24} color={color} />
              ),
              headerShown: false,
            }}
          />
        </Tabs>
      </DatabaseProvider>
    </GluestackUIProvider>
  );
}
