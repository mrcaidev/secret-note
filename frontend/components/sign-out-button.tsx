import { useSignOut } from "@/apis/auth";
import { useRouter } from "expo-router";
import { LogOutIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function SignOutButton() {
  const { mutate } = useSignOut();

  const router = useRouter();

  const signOut = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.push("/sign-in");
      },
    });
  };

  return (
    <Pressable
      onPress={signOut}
      className="group flex flex-row justify-start items-center gap-3 px-6 py-3 web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent web:transition-colors"
    >
      <Icon
        as={LogOutIcon}
        size={18}
        className="text-foreground group-active:text-accent-foreground web:transition-colors"
      />
      <Text className="group-active:text-accent-foreground web:transition-colors">
        Sign Out
      </Text>
    </Pressable>
  );
}
