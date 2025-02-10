import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { HouseIcon } from "lucide-react-native";
import { View } from "react-native";

export default function NotFoundPage() {
  return (
    <View className="grow justify-center items-center bg-background">
      <Text className="mb-2 text-[112px] font-bold">404</Text>
      <Text className="mb-3 text-2xl font-medium">Oops! Page not found</Text>
      <Text className="mb-6 text-muted-foreground text-center text-balance">
        It seems like the page you are looking for does not exist or might have
        been removed.
      </Text>
      <Link href="/" asChild>
        <Button>
          <Icon as={HouseIcon} />
          <Text>Take me home</Text>
        </Button>
      </Link>
    </View>
  );
}
