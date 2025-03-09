import { FontLoader } from "@/components/font-loader";
import { QueryProvider } from "@/components/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <FontLoader>
        <QueryProvider>
          <Slot />
          <PortalHost />
          {Platform.OS === "web" && <ReactQueryDevtools />}
        </QueryProvider>
      </FontLoader>
    </ThemeProvider>
  );
}
