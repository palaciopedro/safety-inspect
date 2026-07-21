import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new-inspection" options={{ headerShown: false }} />
      <Stack.Screen name="inspection/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="new-finding" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}