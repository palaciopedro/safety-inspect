import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Safety Inspect' }} />
      <Stack.Screen name="new-inspection" options={{ title: 'Nova Inspeção' }} />
      <Stack.Screen name="inspection/[id]" options={{ title: 'Detalhes' }} />
      <Stack.Screen name="new-finding" options={{ title: 'Nova Ocorrência' }} />
      <Stack.Screen name="settings" options={{ title: 'Configurações' }} />
    </Stack>
  );
}