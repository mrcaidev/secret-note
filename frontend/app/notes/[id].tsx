import { useNoteQuery } from "@/apis/note";
import { Avatar } from "@/components/avatar";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { H1, Muted, P } from "@/components/ui/typography";
import * as Clipboard from "expo-clipboard";
import { Link, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardIcon,
  HouseIcon,
  PenLineIcon,
  RotateCwIcon,
  Share2Icon,
} from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "medium",
});

export default function NotePage() {
  const { id, password } = useLocalSearchParams<{
    id: string;
    password?: string;
  }>();

  const { data: note, error, isPending } = useNoteQuery(id, password);

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <NotFoundScreen />;
  }

  return (
    <View className="grow px-8 pt-16 bg-background">
      <View className="flex-row justify-between items-center mb-6">
        <HomeLink />
        <SharePopover link={note.link} />
      </View>
      <H1 className="mb-6">{note.title}</H1>
      <View className="flex-row items-center gap-3 mb-6">
        <Avatar user={note.author} className="size-8" />
        <Text className="text-muted-foreground">
          {note.author.nickname} shared with me
        </Text>
      </View>
      {note.content.split("\n").map((paragraph, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: immutable
        <P key={index} className="mb-4">
          {paragraph}
        </P>
      ))}
      <View className="flex-row items-center gap-2 mt-2">
        <Icon as={PenLineIcon} className="text-muted-foreground" />
        <Muted>
          Created on {dateTimeFormat.format(new Date(note.createdAt))}
        </Muted>
      </View>
    </View>
  );
}

function LoadingScreen() {
  return (
    <View className="grow px-8 pt-16 bg-background">
      <View className="flex-row justify-between items-center mb-6">
        <HomeLink />
        <Button disabled>
          <Spinner />
          <Text>Share</Text>
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

function HomeLink() {
  return (
    <Link href="/" asChild>
      <Button variant="outline">
        <Icon as={ArrowLeftIcon} />
        <Text>Home</Text>
      </Button>
    </Link>
  );
}

type HasLinkProps = {
  link: string;
};

function SharePopover({ link }: HasLinkProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Icon as={Share2Icon} />
          <Text>Share</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <Text className="mb-2 font-medium">Share this note</Text>
        <CopyLinkButton link={link} />
      </PopoverContent>
    </Popover>
  );
}

function CopyLinkButton({ link }: HasLinkProps) {
  const [success, setSuccess] = useState<boolean | null>(null);

  const copyToClipboard = async () => {
    const success = await Clipboard.setStringAsync(link);
    setSuccess(success);
  };

  return (
    <View className="flex-row items-center">
      <Input
        value={link}
        editable={false}
        readOnly
        className="rounded-r-none"
      />
      <Button
        variant="outline"
        size="icon"
        onPress={copyToClipboard}
        aria-label="Copy link to clipboard"
        className="rounded-l-none"
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
