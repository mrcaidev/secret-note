import { View } from "react-native";
import { Spinner } from "./spinner";

export function FullscreenLoading() {
  return (
    <View className="grow justify-center items-center bg-background">
      <Spinner size={32} className="text-foreground" />
    </View>
  );
}
