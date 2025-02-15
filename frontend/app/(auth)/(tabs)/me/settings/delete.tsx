import { useDeleteMe } from "@/apis/me";
import { MfaGuard } from "@/components/mfa-guard";
import { Spinner } from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { TrashIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  prompt: v.pipe(
    v.string(),
    v.trim(),
    v.toLowerCase(),
    v.check((input) => input === "delete my account", "Incorrectly typed"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

export default function DeleteAccountSettingPage() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      prompt: "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useDeleteMe();

  const router = useRouter();

  const deleteAccount = handleSubmit(() => {
    mutate(undefined, {
      onSuccess: () => {
        router.push("/sign-in");
      },
    });
  });

  return (
    <MfaGuard>
      <View className="px-6 pt-28">
        <Text className="mb-6 text-muted-foreground">
          Caution! This action is irreversible. All your data will be deleted
          from both local and remote storage, including your profile, articles,
          etc.
        </Text>
        <Controller
          control={control}
          name="prompt"
          render={({ field, fieldState }) => (
            <View className="gap-2 mb-4">
              <Label nativeID="prompt">
                Type "delete my account" to confirm
              </Label>
              <Input
                {...field}
                onChangeText={field.onChange}
                placeholder="delete my account"
                aria-labelledby="prompt"
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
        <Button
          variant="destructive"
          onPress={deleteAccount}
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <Icon as={TrashIcon} />}
          <Text>Delete</Text>
        </Button>
      </View>
    </MfaGuard>
  );
}
