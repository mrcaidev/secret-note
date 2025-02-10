import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

export function StatusBar() {
  const { colorScheme } = useColorScheme();

  return <ExpoStatusBar style={colorScheme === "dark" ? "light" : "dark"} />;
}
