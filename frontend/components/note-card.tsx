import type { PublicNote } from "@/utils/types";
import { Link } from "expo-router";
import { ClockIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { Avatar } from "./avatar";

type Props = {
  note: Omit<PublicNote, "content">;
};

export function NoteCard({ note }: Props) {
  return (
    <View className="relative px-6 py-4">
      <Text className="mb-2.5 line-clamp-2">{note.title}</Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2.5">
          <Avatar user={note.author} className="size-7" />
          <Text className="text-sm text-muted-foreground">
            {note.author.nickname}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon as={ClockIcon} size={14} className="text-muted-foreground" />
          <Text className="text-muted-foreground text-sm">
            {daysAgo(note.createdAt)}
          </Text>
        </View>
      </View>
      <Link
        href={{ pathname: "/notes/[id]", params: { id: note.id } }}
        aria-label="Read note"
        className="absolute inset-0"
      />
    </View>
  );
}

function daysAgo(timestamp: number) {
  const days = (Date.now() - timestamp) / (24 * 60 * 60 * 1000);

  if (days < 1) {
    return "today";
  }

  if (days < 2) {
    return "yesterday";
  }

  return `${Math.floor(days)} days ago`;
}
