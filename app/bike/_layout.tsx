import {Stack} from 'expo-router';

export default function BikeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="create"/>
      <Stack.Screen name="[bikeId]"/>
    </Stack>
  );
}