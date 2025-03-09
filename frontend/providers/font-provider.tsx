import InterVariable from "@/assets/fonts/InterVariable.ttf";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { type PropsWithChildren, useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function FontProvider({ children }: PropsWithChildren) {
  const [loaded, error] = useFonts({ InterVariable });
  const ready = loaded || error;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return children;
}
