import {Stack} from 'expo-router';
import {DatabaseProvider} from "@/context/DatabaseContext";

export default function RootLayout() {
    return (
        <DatabaseProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="+not-found"/>
            </Stack>
        </DatabaseProvider>
    );
}
