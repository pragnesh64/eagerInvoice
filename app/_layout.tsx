import { Stack } from 'expo-router';
import { DataProvider } from '../context/DataContext';

export default function RootLayout() {
  return (
    <DataProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </DataProvider>
  );
}
