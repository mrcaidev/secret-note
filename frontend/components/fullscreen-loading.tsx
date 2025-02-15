import { View } from "react-native";
import { Spinner } from "./spinner";

export function FullscreenLoading() {
  return (
    <View className="grow justify-center items-center">
      <Spinner size={32} />
    </View>
  );
}
