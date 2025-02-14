import type { ExpoConfig } from "expo/config";

export default {
  name: "Secret Note",
  description: "A modern, neat and secure way to paste and share.",
  slug: "secret-note",
  owner: "mrcaidev",
  version: "0.1.0",
  platforms: ["ios", "android", "web"],
  githubUrl: "https://github.com/mrcaidev/secret-note",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  scheme: "secret-note",
  plugins: [
    [
      "expo-font",
      {
        fonts: ["./assets/fonts/Inter-Regular.ttf"],
      },
    ],
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/images/icon.png",
        dark: {
          backgroundColor: "#0c0a09",
          image: "./assets/images/icon.png",
        },
      },
    ],
    "expo-sqlite",
  ],
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "dev.mrcai.secretnote",
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      CFBundleURLTypes: [
        {
          CFBundleURLSchemes: [
            "com.googleusercontent.apps.1041111204276-a0ae9633f1ltonn0hsdlg0lo4bd99h3q",
          ],
        },
      ],
    },
  },
  android: {
    package: "dev.mrcai.secretnote",
  },
  web: {
    output: "static",
    favicon: "./assets/images/icon.png",
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: "226c083a-771c-4e3e-b718-d23e5390d947",
    },
  },
} satisfies ExpoConfig;
