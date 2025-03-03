import type { PublicUser } from "@/utils/types";
import type { ComponentProps } from "react";
import { AvatarFallback, AvatarImage, Avatar as BaseAvatar } from "./ui/avatar";
import { Text } from "./ui/text";

type Props = Partial<ComponentProps<typeof BaseAvatar>> & {
  user: Pick<PublicUser, "nickname" | "avatarUrl">;
};

export function Avatar({ user, alt = "Avatar", ...props }: Props) {
  return (
    <BaseAvatar alt={alt} {...props}>
      <AvatarImage source={{ uri: user.avatarUrl }} />
      <AvatarFallback>
        <Text className="uppercase">{user.nickname[0]}</Text>
      </AvatarFallback>
    </BaseAvatar>
  );
}
