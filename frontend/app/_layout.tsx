import "@/global.css";
import { FontProvider } from "@/providers/font-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <FontProvider>
        <QueryProvider>
          <Slot />
          <PortalHost />
        </QueryProvider>
      </FontProvider>
    </ThemeProvider>
  );
}
