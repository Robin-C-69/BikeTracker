import "../i18n";
import { Tabs } from "expo-router";
import { DatabaseProvider } from "@/context/DatabaseContext";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { StatusBar } from "react-native";
import CustomHeader from "@/components/common/CustomHeader";
import * as SplashScreen from "expo-splash-screen";
import { useTranslation } from "react-i18next";

const APP_TITLE = "BikeTracker";

SplashScreen.setOptions({
  duration: 1000,
});

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <GluestackUIProvider mode="dark">
      <DatabaseProvider>
        <StatusBar hidden={true} />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.colors.primaryLight,
            tabBarStyle: {
              backgroundColor: theme.colors.background,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.default,
              height: "10%",
            },
            sceneStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }} />
          <Tabs.Screen
            name="bikes"
            options={{
              title: `${t("Bikes")}`,
              tabBarIcon: ({ color }) => (
                <Ionicons name="bicycle" size={24} color={color} />
              ),
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="next"
            options={{
              title: "Next",
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name="ellipsis-horizontal-outline"
                  size={24}
                  color={color}
                />
              ),
              headerShown: true,
              header: () => <CustomHeader title={APP_TITLE} />,
            }}
          />
        </Tabs>
      </DatabaseProvider>
    </GluestackUIProvider>
  );
}
