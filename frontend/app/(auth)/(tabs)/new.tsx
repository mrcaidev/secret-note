import { useCreateNote } from "@/apis/note";
import { FormError } from "@/components/form-error";
import { FormFieldError } from "@/components/form-field-error";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { Share2Icon, XIcon } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  title: v.pipe(
    v.string(),
    v.minLength(1, "Title is required"),
    v.maxLength(100, "Title should be less than 100 characters"),
  ),
  content: v.pipe(v.string(), v.minLength(1, "Content is required")),
  passwordNeeded: v.boolean(),
  burnAfterRead: v.boolean(),
});

type Schema = v.InferOutput<typeof schema>;

export default function NewNotePage() {
  const { control, handleSubmit, formState } = useForm<Schema>({
    defaultValues: {
      title: "",
      content: "",
      passwordNeeded: false,
      burnAfterRead: false,
    },
    resolver: valibotResolver(schema),
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();

  const { mutate, error, isPending } = useCreateNote();

  const createNote = handleSubmit((data) => {
    mutate(data, {
      onSuccess: (note) => {
        setDialogOpen(false);
        router.push(`/notes/${note.id}`);
      },
    });
  });

  return (
    <View className="grow px-6 pt-16">
      <Controller
        control={control}
        name="title"
        render={({ field, fieldState }) => (
          <View className="gap-2 mb-2">
            <TextInput
              {...field}
              onChangeText={field.onChange}
              placeholder="Title"
              className="px-1 py-2 border-b border-input web:focus-visible:border-primary web:focus-visible:outline-none text-foreground text-2xl font-bold font-sans placeholder:text-muted-foreground placeholder:font-sans"
            />
            <FormFieldError error={fieldState.error} />
          </View>
        )}
      />
      <Controller
        control={control}
        name="content"
        render={({ field, fieldState }) => (
          <View className="grow gap-2 mb-4">
            <TextInput
              {...field}
              multiline
              textAlignVertical="top"
              onChangeText={field.onChange}
              placeholder="Paste and share!"
              className="grow px-1 web:focus-visible:outline-none text-foreground text-base font-sans placeholder:text-muted-foreground placeholder:font-sans"
            />
            <FormFieldError error={fieldState.error} />
          </View>
        )}
      />
      <FormError error={error} className="mb-4" />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={!formState.isValid} className="mb-4">
            <Icon as={Share2Icon} />
            <Text>Share</Text>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize this note's security and privacy settings.
            </DialogDescription>
          </DialogHeader>
          <View className="gap-3">
            <Controller
              control={control}
              name="passwordNeeded"
              render={({ field }) => (
                <View className="flex-row items-center gap-2.5">
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="peer"
                  />
                  <Text className="text-muted-foreground peer-data-[state=checked]:text-foreground font-normal">
                    Password protection
                  </Text>
                </View>
              )}
            />
            <Controller
              control={control}
              name="burnAfterRead"
              render={({ field }) => (
                <View className="flex-row items-center gap-2.5">
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="peer"
                  />
                  <Text className="text-muted-foreground peer-data-[state=checked]:text-foreground font-normal">
                    Burn after read
                  </Text>
                </View>
              )}
            />
          </View>
          <DialogFooter className="flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary">
                <Icon as={XIcon} />
                <Text>Cancel</Text>
              </Button>
            </DialogClose>
            <Button
              disabled={isPending || !formState.isValid}
              onPress={createNote}
            >
              {isPending ? <Spinner /> : <Icon as={Share2Icon} />}
              <Text>Share</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
