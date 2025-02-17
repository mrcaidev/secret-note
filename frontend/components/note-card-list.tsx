import { useNotesInfiniteQuery } from "@/apis/note";
import { Link } from "expo-router";
import { CloudAlertIcon } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { NoteCard } from "./note-card";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";
import { Text } from "./ui/text";

export function NoteCardList() {
  const { data, error, isPending, hasNextPage, fetchNextPage } =
    useNotesInfiniteQuery();

  if (isPending) {
    return (
      <View className="gap-2 px-6 pt-1">
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
        <Skeleton className="h-24 rounded-md" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="grow justify-center px-8">
        <Icon
          as={CloudAlertIcon}
          size={40}
          className="mb-3 text-muted-foreground"
        />
        <Text className="mb-2 text-muted-foreground font-medium">
          Uh... We can&apos;t seem to retrieve your notes at the moment 😢
        </Text>
        <Text className="text-muted-foreground text-sm">{error.message}</Text>
      </View>
    );
  }

  const notes = data.pages.flatMap(({ notes }) => notes);

  if (notes.length === 0) {
    return (
      <View className="grow justify-center items-center">
        <Text className="text-muted-foreground text-sm text-center">
          You don&apos;t have any notes yet.
        </Text>
        <Link href="/new" asChild>
          <Button variant="link">
            <Text>Create a note</Text>
          </Button>
        </Link>
      </View>
    );
  }

  return (
    <FlatList
      data={notes}
      renderItem={({ item }) => <NoteCard note={item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      contentContainerClassName="px-4 pt-1 pb-32"
      ItemSeparatorComponent={() => <Separator className="my-1" />}
      ListFooterComponent={
        <Text className="my-2 text-muted-foreground text-xs text-center">
          {hasNextPage ? "Loading more for you..." : "- That's all, for now -"}
        </Text>
      }
    />
  );
}
