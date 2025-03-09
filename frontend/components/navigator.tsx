import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { ArrowRightIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";
import { FormFieldError } from "./form-field-error";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Input } from "./ui/input";

const schema = v.object({
  link: v.pipe(
    v.string(),
    v.url("Invalid link"),
    v.transform((value) => new URL(value).pathname),
    v.startsWith("/notes/", "Invalid link"),
    v.transform((value) => value.substring(7)),
    v.uuid("Invalid link"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

export function Navigator() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      link: "",
    },
    resolver: valibotResolver(schema),
  });

  const router = useRouter();

  const navigate = handleSubmit((data) => {
    router.push(`/notes/${data.link}`);
  });

  return (
    <View className="flex-row gap-2 px-6 py-2">
      <Controller
        control={control}
        name="link"
        render={({ field, fieldState }) => (
          <View className="grow">
            <Input
              {...field}
              placeholder="Paste other's link here!"
              onSubmitEditing={navigate}
              aria-label="Link to shared note"
            />
            <FormFieldError error={fieldState.error} />
          </View>
        )}
      />
      <Button
        variant="ghost"
        size="icon"
        onPress={navigate}
        className="native:size-12"
      >
        <Icon as={ArrowRightIcon} />
      </Button>
    </View>
  );
}
