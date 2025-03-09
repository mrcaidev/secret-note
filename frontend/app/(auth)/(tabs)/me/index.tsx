import { useMeQuery } from "@/apis/me";
import { Avatar } from "@/components/avatar";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { cn } from "@/components/ui/utils";
import { Link } from "expo-router";
import {
  CodeXmlIcon,
  type LucideIcon,
  ShieldIcon,
  TrashIcon,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { View } from "react-native";

export default function MePage() {
  const { data: me } = useMeQuery();

  if (!me) {
    return null;
  }

  return (
    <View className="px-4 pt-24">
      <View className="flex-row items-center gap-4 px-4 py-3">
        <Avatar user={me} className="size-16" />
        <View className="gap-1">
          <Text className="text-xl font-bold line-clamp-1">{me.nickname}</Text>
          <Text className="text-muted-foreground line-clamp-1">{me.email}</Text>
        </View>
      </View>
      <Separator className="my-3" />
      <SignOutButton />
      <SubpageLink href="/me/delete" icon={TrashIcon} destructive>
        Delete Account
      </SubpageLink>
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
  destructive?: boolean;
};

function SubpageLink({
  icon,
  destructive = false,
  children,
  ...props
}: SubpageLinkProps) {
  return (
    <Link {...props} asChild>
      <Button variant="ghost" className="justify-start gap-3">
        <Icon
          as={icon}
          size={18}
          className={cn(destructive && "text-destructive")}
        />
        <Text className={cn(destructive && "text-destructive")}>
          {children}
        </Text>
      </Button>
    </Link>
  );
}
