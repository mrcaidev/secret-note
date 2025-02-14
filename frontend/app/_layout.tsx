import { FontLoader } from "@/components/font-loader";
import { QueryProvider } from "@/components/query-provider";
import { StatusBar } from "@/components/status-bar";
import { ThemeProvider } from "@/components/theme-provider";
import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar />
      <FontLoader>
        <QueryProvider>
          <Slot />
          <PortalHost />
        </QueryProvider>
      </FontLoader>
    </ThemeProvider>
  );
}
