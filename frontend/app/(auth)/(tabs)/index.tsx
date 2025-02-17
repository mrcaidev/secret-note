import { NoteCardList } from "@/components/note-card-list";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function HomePage() {
  return (
    <View className="grow bg-background">
      <Text className="px-6 pt-16 pb-3 text-2xl font-bold">Home</Text>
      <NoteCardList />
    </View>
  );
}
