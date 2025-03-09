import type { ExpoConfig } from "expo/config";

export default {
  name: "Secret Note",
  description: "A modern, neat and secure way to paste and share.",
  slug: "secret-note",
  owner: "mrcaidev",
  sdkVersion: "52.0.0",
  version: "0.1.0",
  platforms: ["web", "android", "ios"],
  githubUrl: "https://github.com/mrcaidev/secret-note",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "assets/images/favicon.png",
  scheme: "secret-note",
  extra: {
    eas: {
      projectId: "226c083a-771c-4e3e-b718-d23e5390d947",
    },
  },
  plugins: [
    [
      "expo-font",
      {
        fonts: ["assets/fonts/InterVariable.ttf"],
      },
    ],
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#00a63e",
        image: "assets/images/splash.png",
        imageWidth: 200,
      },
    ],
    [
      "expo-sqlite",
      {
        useSQLCipher: true,
      },
    ],
  ],
  jsEngine: "hermes",
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
    adaptiveIcon: {
      foregroundImage: "assets/images/adaptive-icon.png",
      backgroundColor: "#00a63e",
    },
  },
  web: {
    output: "static",
    favicon: "assets/images/favicon.png",
    name: "Secret Note",
    shortName: "Secret Note",
    lang: "en",
    description: "A modern, neat and secure way to paste and share.",
    bundler: "metro",
  },
  experiments: {
    typedRoutes: true,
  },
} satisfies ExpoConfig;
