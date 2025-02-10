import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true }}>
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="nickname" options={{ title: "Update Nickname" }} />
      <Stack.Screen name="email" options={{ title: "Update Email" }} />
      <Stack.Screen name="password" options={{ title: "Update Password" }} />
      <Stack.Screen name="delete" options={{ title: "Delete Account" }} />
    </Stack>
  );
}
