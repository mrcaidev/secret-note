import { useNoteQuery } from "@/apis/note";
import { Avatar } from "@/components/avatar";
import { FullscreenLoading } from "@/components/fullscreen-loading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { H1, Muted, P } from "@/components/ui/typography";
import { Link, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon, PenLineIcon } from "lucide-react-native";
import { View } from "react-native";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "medium",
});

export default function NotePage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: note, error, isPending } = useNoteQuery(id);

  if (isPending) {
    return <FullscreenLoading />;
  }

  if (error) {
    return (
      <View className="grow justify-center items-center">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="px-8 py-16">
      <Link href="/" className="flex flex-row items-center gap-2 py-5">
        <Icon as={ArrowLeftIcon} size={18} className="text-muted-foreground" />
        <Text className="text-muted-foreground">Home</Text>
      </Link>
      <H1 className="mb-6">{note.title}</H1>
      <View className="flex-row items-center gap-3 mb-6">
        <Avatar user={note.author} className="size-8" />
        <Text className="text-muted-foreground">
          {note.author.nickname} shared with me
        </Text>
      </View>
      {note.content.split("\n").map((line) => (
        <P key={line}>{line}</P>
      ))}
      <View className="flex-row items-center gap-2 mt-6">
        <Icon as={PenLineIcon} className="text-muted-foreground" />
        <Muted>
          Created on {dateTimeFormat.format(new Date(note.createdAt))}
        </Muted>
      </View>
    </View>
  );
}
