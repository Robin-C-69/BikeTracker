import { Stack } from "expo-router";
import { DatabaseProvider } from "@/app/context/DatabaseContext";

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bike" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </DatabaseProvider>
  );
}
