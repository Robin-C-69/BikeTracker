import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import CustomHeader from "@/components/common/CustomHeader";
import { theme } from "@/constants/theme";

const APP_TITLE = "BikeTracker";

export default function TabLayout() {
  useEffect(() => {
    const setupFullScreen = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
      }
    };
    setupFullScreen();
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarStyle: {
            backgroundColor: theme.colors.surfaceVariant,
            borderTopWidth: 0,
            height: "8%",
          },
        }}
      >
        <Tabs.Screen
          name="bike"
          options={{
            title: "Garage",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                color={color}
                size={24}
              />
            ),
            headerShown: true,
            header: () => (
              <CustomHeader title={APP_TITLE} showBackButton={false} />
            ),
          }}
        />
        <Tabs.Screen
          name="techs"
          options={{
            title: "Techs",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
