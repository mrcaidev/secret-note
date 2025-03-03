import { useMeQuery } from "@/apis/me";
import { AvatarPicker } from "@/components/avatar-picker";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Link } from "expo-router";
import { ChevronRightIcon } from "lucide-react-native";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";

export default function SettingPage() {
  const { data: me } = useMeQuery();

  if (!me) {
    return null;
  }

  return (
    <View className="pt-28">
      <View className="divide-y divide-border">
        <AvatarPicker currentAvatarUrl={me.avatarUrl} />
        <PageLink
          href="/me/settings/nickname"
          name="Nickname"
          value={me.nickname}
        />
        <PageLink href="/me/settings/email" name="Email" value={me.email} />
        <PageLink href="/me/settings/password" name="Password" value="" />
        <PageLink href="/me/settings/delete" name="Delete Account" value="" />
      </View>
    </View>
  );
}

type PageLinkProps = ComponentProps<typeof Link> & {
  name: string;
  value: string;
};

function PageLink({ name, value, ...props }: PageLinkProps) {
  return (
    <Link {...props} asChild>
      <Pressable className="group flex flex-row justify-start items-center px-6 py-4 web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent web:transition-colors">
        <Text className="group-active:text-accent-foreground web:transition-colors">
          {name}
        </Text>
        <View className="grow" />
        <Text className="text-muted-foreground group-active:text-accent-foreground text-sm web:transition-colors">
          {value}
        </Text>
        <Icon
          as={ChevronRightIcon}
          className="ml-2 text-muted-foreground group-active:text-accent-foreground web:transition-colors"
        />
      </Pressable>
    </Link>
  );
}
