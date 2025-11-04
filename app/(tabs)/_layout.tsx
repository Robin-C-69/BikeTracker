import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Platform, StatusBar } from "react-native";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import CustomHeader from "@/app/components/common/CustomHeader";

export default function TabLayout() {
  const router = useRouter();

  const navigateToAddBike = () => {
    router.navigate({ pathname: "/bike/create" });
  };

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
          tabBarActiveTintColor: "#ffd33d",
          tabBarStyle: {
            backgroundColor: "#25292e",
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
              <CustomHeader
                actionButton={navigateToAddBike}
                actionButtonName={"add"}
                showBackButton={false}
              />
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
