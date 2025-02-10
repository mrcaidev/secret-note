import { NoteCardList } from "@/components/note-card-list";
import { Text } from "@/components/ui/text";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <Text className="px-6 pt-16 pb-4 text-2xl font-bold">Home</Text>
      <NoteCardList />
    </Fragment>
  );
}
