import {
  ThemeProvider as NativeThemeProvider,
  type Theme,
} from "@react-navigation/native";
import { useColorScheme } from "nativewind";
import type { PropsWithChildren } from "react";

const fonts: Theme["fonts"] = {
  regular: {
    fontFamily: "InterVariable",
    fontWeight: "400",
  },
  medium: {
    fontFamily: "InterVariable",
    fontWeight: "500",
  },
  bold: {
    fontFamily: "InterVariable",
    fontWeight: "700",
  },
  heavy: {
    fontFamily: "InterVariable",
    fontWeight: "900",
  },
};

const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "hsl(0 0% 100%)",
    text: "hsl(240 10% 3.9%)",
    card: "hsl(0 0% 100%)",
    primary: "hsl(142.1 76.2% 36.3%)",
    notification: "hsl(0 84.2% 60.2%)",
    border: "hsl(240 5.9% 90%)",
  },
  fonts,
};

const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "hsl(20 14.3% 4.1%)",
    text: "hsl(0 0% 95%)",
    card: "hsl(24 9.8% 10%)",
    primary: "hsl(142.1 70.6% 45.3%)",
    notification: "hsl(0 62.8% 30.6%)",
    border: "hsl(240 3.7% 15.9%)",
  },
  fonts,
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const { colorScheme } = useColorScheme();

  return (
    <NativeThemeProvider
      value={colorScheme === "dark" ? darkTheme : lightTheme}
    >
      {children}
    </NativeThemeProvider>
  );
}
