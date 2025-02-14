declare module "*.css" {}
declare module "*.ttf" {}

namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE_URL: string;
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID: string;
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: string;
  }
}
