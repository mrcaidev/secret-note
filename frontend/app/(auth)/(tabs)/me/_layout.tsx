import { Stack } from "expo-router";

export default function MeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="delete" options={{ title: "Delete Account" }} />
    </Stack>
  );
}
