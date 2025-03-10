import { useSignOutMutation } from "@/apis/auth";
import { useMeQuery } from "@/apis/me";
import { Avatar } from "@/components/avatar";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Link, Redirect, useRouter } from "expo-router";
import {
  CodeXmlIcon,
  LifeBuoyIcon,
  LogOutIcon,
  type LucideIcon,
  ShieldIcon,
  TrashIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";

export default function MePage() {
  return (
    <View className="px-4 pt-24">
      <Profile />
      <Separator className="my-3" />
      <SignOutButton />
      <ButtonLink href="/me/delete" icon={TrashIcon}>
        Delete Account
      </ButtonLink>
      <Separator className="my-3" />
      <ButtonLink
        href="https://github.com/mrcaidev/secret-note/issues"
        icon={LifeBuoyIcon}
      >
        Support
      </ButtonLink>
      <ButtonLink href="/privacy" icon={ShieldIcon}>
        Privacy Policy
      </ButtonLink>
      <ButtonLink
        href="https://github.com/mrcaidev/secret-note"
        icon={CodeXmlIcon}
      >
        Source Code
      </ButtonLink>
    </View>
  );
}

function Profile() {
  const { data: me } = useMeQuery();

  if (!me) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-row items-center gap-4 px-4 py-3">
      <Avatar user={me} className="size-16" />
      <View className="gap-1">
        <Text className="text-xl font-bold line-clamp-1">{me.nickname}</Text>
        <Text className="text-muted-foreground line-clamp-1">{me.email}</Text>
      </View>
    </View>
  );
}

function SignOutButton() {
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

type ButtonLinkProps = ComponentProps<typeof Link> & {
  icon: LucideIcon;
};

function ButtonLink({ icon, children, ...props }: ButtonLinkProps) {
  return (
    <Link {...props} asChild>
      <Button variant="ghost" className="justify-start gap-3">
        <Icon as={icon} size={18} />
        <Text>{children}</Text>
      </Button>
    </Link>
  );
}
