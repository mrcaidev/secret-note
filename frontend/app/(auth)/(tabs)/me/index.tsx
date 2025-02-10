import { useMe } from "@/apis/me";
import { Avatar } from "@/components/avatar";
import { SignOutButton } from "@/components/sign-out-button";
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
import { Pressable, View } from "react-native";

export default function MePage() {
  const { data: me } = useMe();

  if (!me) {
    return null;
  }

  return (
    <View className="pt-16">
      <View className="flex-row items-center gap-5 px-6 py-4">
        <Avatar user={me} className="size-16" />
        <View className="gap-1">
          <Text className="text-2xl font-bold line-clamp-1">{me.nickname}</Text>
          <Text className="text-muted-foreground line-clamp-1">{me.email}</Text>
        </View>
      </View>
      <Separator className="my-2" />
      <PageLink href="/me/settings" icon={SettingsIcon}>
        Settings
      </PageLink>
      <SignOutButton />
      <Separator className="my-2" />
      <PageLink href="/privacy" icon={ShieldIcon}>
        Privacy Policy
      </PageLink>
      <PageLink
        href="https://github.com/mrcaidev/secret-note"
        icon={CodeXmlIcon}
      >
        Source Code
      </PageLink>
    </View>
  );
}

type PageLinkProps = ComponentProps<typeof Link> & {
  icon: LucideIcon;
};

function PageLink({ icon, children, ...props }: PageLinkProps) {
  return (
    <Link {...props} asChild>
      <Pressable className="group flex flex-row justify-start items-center gap-3 px-6 py-3 web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent web:transition-colors">
        <Icon
          as={icon}
          size={18}
          className="text-foreground group-active:text-accent-foreground web:transition-colors"
        />
        <Text className="group-active:text-accent-foreground web:transition-colors">
          {children}
        </Text>
      </Pressable>
    </Link>
  );
}
