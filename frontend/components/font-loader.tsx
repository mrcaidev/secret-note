import InterVariable from "@/assets/fonts/InterVariable.ttf";
import { useFonts } from "expo-font";
import { Fragment, type PropsWithChildren } from "react";
import { Platform } from "react-native";
import { FullscreenLoading } from "./fullscreen-loading";

function WebFontLoader({ children }: PropsWithChildren) {
  const [fontsLoaded] = useFonts({ InterVariable });

  if (!fontsLoaded) {
    return <FullscreenLoading />;
  }

  return children;
}

export const FontLoader = Platform.OS === "web" ? WebFontLoader : Fragment;
