import { useMe } from "@/apis/me";
import { Avatar } from "@/components/avatar";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import {
  CodeXmlIcon,
  SettingsIcon,
  ShieldIcon,
  type LucideIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";

export default function MePage() {
  const { data: me } = useMe();

  if (!me) {
    return null;
  }

  return (
    <View className="px-4 pt-24">
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Avatar user={me} className="size-16" />
        <View className="gap-1">
          <Text className="text-xl font-bold line-clamp-1">{me.nickname}</Text>
          <Text className="text-muted-foreground text-sm line-clamp-1">
            {me.email}
          </Text>
        </View>
      </View>
      <Separator className="my-3" />
      <SubpageLink href="/me/settings" icon={SettingsIcon}>
        Settings
      </SubpageLink>
      <SignOutButton />
      <Separator className="my-3" />
      <SubpageLink href="/privacy" icon={ShieldIcon}>
        Privacy Policy
      </SubpageLink>
      <SubpageLink
        href="https://github.com/mrcaidev/secret-note"
        icon={CodeXmlIcon}
      >
        Source Code
      </SubpageLink>
    </View>
  );
}

type SubpageLinkProps = ComponentProps<typeof Link> & {
  icon: LucideIcon;
};

function SubpageLink({ icon, children, ...props }: SubpageLinkProps) {
  return (
    <Link {...props} asChild>
      <Button variant="ghost" className="justify-start gap-3">
        <Icon as={icon} size={18} />
        <Text>{children}</Text>
      </Button>
    </Link>
  );
}
