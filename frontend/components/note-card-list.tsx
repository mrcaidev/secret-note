import { useNotes } from "@/apis/note";
import { FlatList, View } from "react-native";
import { NoteCard } from "./note-card";
import { Text } from "./ui/text";

export function NoteCardList() {
  const { data: notes, error, isPending } = useNotes();

  if (isPending) {
    return (
      <View className="grow gap-2 px-6">
        <View className="h-28 rounded-md bg-card animate-pulse" />
        <View className="h-28 rounded-md bg-card animate-pulse" />
        <View className="h-28 rounded-md bg-card animate-pulse" />
        <View className="h-28 rounded-md bg-card animate-pulse" />
        <View className="h-28 rounded-md bg-card animate-pulse" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="grow justify-center items-center">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      renderItem={({ item }) => <NoteCard note={item} />}
      contentContainerClassName="divide-y divide-border"
    />
  );
}
