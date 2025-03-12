import { useMeQuery } from "@/apis/me";
import { useDeleteNoteMutation, useNoteQuery } from "@/apis/note";
import { Avatar } from "@/components/avatar";
import { FormError } from "@/components/form-error";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { H1, Muted, P } from "@/components/ui/typography";
import type { PublicNote } from "@/utils/types";
import * as Clipboard from "expo-clipboard";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardIcon,
  EllipsisVerticalIcon,
  HouseIcon,
  PenLineIcon,
  RotateCwIcon,
  Share2Icon,
  TrashIcon,
  XIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "medium",
});

function useThisNote() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return useNoteQuery(id);
}

export default function NotePage() {
  const { data: note, error, isPending } = useThisNote();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <NotFoundScreen />;
  }

  return (
    <View className="grow px-6 pt-16 bg-background">
      <View className="flex-row justify-between items-center mb-6">
        <HomeLink />
        <Menu />
      </View>
      <ScrollView>
        <H1 className="mb-6">{note.title}</H1>
        <Author author={note.author} />
        {note.content.split("\n").map((paragraph, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: immutable
          <P key={index} className="mb-4">
            {paragraph}
          </P>
        ))}
        <View className="flex-row items-center gap-2 mt-2 mb-24">
          <Icon as={PenLineIcon} className="text-muted-foreground" />
          <Muted>
            Created on {dateTimeFormat.format(new Date(note.createdAt))}
          </Muted>
        </View>
      </ScrollView>
    </View>
  );
}

function LoadingScreen() {
  return (
    <View className="grow px-6 pt-16 bg-background">
      <View className="flex-row justify-between items-center mb-6">
        <HomeLink />
        <Button variant="ghost" size="icon" aria-label="Open menu" disabled>
          <Icon as={EllipsisVerticalIcon} />
        </Button>
      </View>
      <Skeleton className="h-10 mb-6" />
      <View className="flex-row items-center gap-3 mb-6">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="grow h-8" />
      </View>
      <Skeleton className="grow mb-6" />
      <Skeleton className="w-2/3 h-5 mb-6" />
    </View>
  );
}

function NotFoundScreen() {
  return (
    <View className="grow justify-center items-center px-8 bg-background">
      <Text className="mb-2 text-[112px] font-bold">404</Text>
      <Text className="mb-3 text-2xl font-medium">Oops! Note not found</Text>
      <Text className="mb-6 text-muted-foreground text-center text-balance">
        This note no longer exists... Or maybe it never did.
      </Text>
      <Link href="/" asChild>
        <Button>
          <Icon as={HouseIcon} />
          <Text>Take me home</Text>
        </Button>
      </Link>
    </View>
  );
}

function Author({ author }: Pick<PublicNote, "author">) {
  const { data: me } = useMeQuery();

  return (
    <View className="flex-row items-center gap-3 mb-6">
      <Avatar user={author} className="size-8" />
      <Text className="text-muted-foreground">
        Created by {me?.id === author.id ? "me" : author.nickname}
      </Text>
    </View>
  );
}

function HomeLink() {
  return (
    <Link href="/" asChild>
      <Pressable className="flex-row items-center gap-2 py-2">
        <Icon as={ArrowLeftIcon} className="text-muted-foreground" />
        <Text className="text-muted-foreground">Home</Text>
      </Pressable>
    </Link>
  );
}

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Icon as={EllipsisVerticalIcon} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ShareDialog />
        <DeleteDialog />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ShareDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem closeOnPress={false}>
          <Icon as={Share2Icon} />
          <Text>Share</Text>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this note</DialogTitle>
          <DialogDescription>
            Copy the link below and share it with your friends!
          </DialogDescription>
        </DialogHeader>
        <View>
          <CopyLinkBar />
        </View>
      </DialogContent>
    </Dialog>
  );
}

function CopyLinkBar() {
  const { data: note } = useThisNote();

  const [success, setSuccess] = useState<boolean | null>(null);

  const copy = async () => {
    if (!note) {
      return;
    }

    const success = await Clipboard.setStringAsync(note.link);
    setSuccess(success);
  };

  return (
    <View className="flex-row items-center">
      <Input
        value={note?.link}
        editable={false}
        readOnly
        className="rounded-r-none"
      />
      <Button
        variant="outline"
        size="icon"
        onPress={copy}
        aria-label="Copy link to clipboard"
        className="native:size-12 rounded-l-none"
      >
        {success === null ? (
          <Icon as={ClipboardIcon} />
        ) : success ? (
          <Icon as={CheckIcon} />
        ) : (
          <Icon as={RotateCwIcon} />
        )}
      </Button>
    </View>
  );
}

function DeleteDialog() {
  const { data: note } = useThisNote();
  const { data: me } = useMeQuery();

  const { mutate, isPending, error } = useDeleteNoteMutation();

  const router = useRouter();

  if (!me || !note || me.id !== note.author.id) {
    return null;
  }

  const deleteNote = () => {
    mutate(note.id, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem closeOnPress={false}>
          <Icon
            as={TrashIcon}
            className="text-destructive hover:text-destructive"
          />
          <Text className="text-destructive hover:text-destructive">
            Delete
          </Text>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Delete this note</DialogTitle>
          <DialogDescription>
            This action is irreversible. The note will be permanently deleted,
            and no one will be able to access it again.
          </DialogDescription>
        </DialogHeader>
        <FormError error={error} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">
              <Icon as={XIcon} />
              <Text>Cancel</Text>
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onPress={deleteNote}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <Icon as={TrashIcon} />}
            <Text>Delete</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
