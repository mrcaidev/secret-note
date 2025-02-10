import { Loader2Icon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "./ui/icon";

export function FullscreenLoading() {
  return (
    <View className="grow justify-center items-center">
      <View className="animate-spin">
        <Icon as={Loader2Icon} size={32} className="text-foreground" />
      </View>
    </View>
  );
}
