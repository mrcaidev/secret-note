import { useMe, useUpdateMe } from "@/apis/me";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { Loader2Icon, SaveIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  nickname: v.pipe(
    v.string(),
    v.minLength(2, "Nickname should be 2-20 characters long"),
    v.maxLength(20, "Nickname should be 2-20 characters long"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

export default function NicknameSettingPage() {
  const { data: me } = useMe();

  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      nickname: me?.nickname ?? "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useUpdateMe();

  const router = useRouter();

  const updateNickname = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/me/settings");
      },
    });
  });

  return (
    <View className="px-6 pt-28">
      <Text className="mb-6 text-muted-foreground">
        This is how everybody will see you on the platform.
      </Text>
      <Controller
        control={control}
        name="nickname"
        render={({ field, fieldState }) => (
          <View className="gap-2 mb-4">
            <Label nativeID="nickname">Nickname</Label>
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="2-20 characters"
              autoComplete="nickname"
              aria-labelledby="nickname"
            />
            {fieldState.error && (
              <Text className="text-destructive text-sm">
                {fieldState.error.message}
              </Text>
            )}
          </View>
        )}
      />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Button onPress={updateNickname} disabled={isPending}>
        {isPending ? (
          <Icon as={Loader2Icon} className="animate-spin" />
        ) : (
          <Icon as={SaveIcon} />
        )}
        <Text>Update</Text>
      </Button>
    </View>
  );
}
