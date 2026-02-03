import { Stack } from "expo-router";
import { DatabaseProvider } from "@/app/context/DatabaseContext";

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function RootLayout() {
  return (
    
    <GluestackUIProvider mode="dark">
      <DatabaseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bike" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </DatabaseProvider>
    </GluestackUIProvider>
  
  );
}
