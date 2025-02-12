declare module "*.ttf" {}

namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE_URL: string;
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: string;
  }
}
