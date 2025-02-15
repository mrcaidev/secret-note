import { Loader2Icon, type LucideProps } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "./ui/icon";

export function Spinner(props: LucideProps) {
  return (
    <View className="animate-spin">
      <Icon as={Loader2Icon} {...props} />
    </View>
  );
}
