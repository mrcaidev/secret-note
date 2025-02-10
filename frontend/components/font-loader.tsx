import InterRegular from "@/assets/fonts/Inter-Regular.ttf";
import { useFonts } from "expo-font";
import { Fragment, type PropsWithChildren } from "react";
import { Platform } from "react-native";
import { FullscreenLoading } from "./fullscreen-loading";

function WebFontLoader({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({ "Inter-Regular": InterRegular });

  if (!fontsLoaded) {
    return <FullscreenLoading />;
  }

  return children;
}

export const FontLoader = Platform.OS === "web" ? WebFontLoader : Fragment;
