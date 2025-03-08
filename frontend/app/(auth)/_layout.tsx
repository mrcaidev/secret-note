import { useMeQuery } from "@/apis/me";
import { FullscreenLoading } from "@/components/fullscreen-loading";
import { Redirect, Stack } from "expo-router";

export default function AuthGuard() {
  const { data, isPending } = useMeQuery();

  if (isPending) {
    return <FullscreenLoading />;
  }

  if (!data) {
    return <Redirect href="/sign-in" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
