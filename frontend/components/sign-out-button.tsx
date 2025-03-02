import { useSignOutMutation } from "@/apis/auth";
import { useRouter } from "expo-router";
import { LogOutIcon } from "lucide-react-native";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function SignOutButton() {
  const { mutate, isPending } = useSignOutMutation();

  const router = useRouter();

  const signOut = () => {
    mutate(undefined, {
      onSuccess: () => {
        router.push("/sign-in");
      },
    });
  };

  return (
    <Button
      variant="ghost"
      onPress={signOut}
      disabled={isPending}
      className="justify-start gap-3"
    >
      {isPending ? <Spinner size={18} /> : <Icon as={LogOutIcon} size={18} />}
      <Text>Sign Out</Text>
    </Button>
  );
}
