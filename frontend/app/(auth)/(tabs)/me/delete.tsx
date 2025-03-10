import { useDeleteMeMutation } from "@/apis/me";
import { FormError } from "@/components/form-error";
import { FormFieldError } from "@/components/form-field-error";
import { MfaGuard } from "@/components/mfa-guard";
import { Spinner } from "@/components/spinner";
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
    v.check((input) => input === "delete my account", "Incorrect input"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

export default function DeleteAccountPage() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      prompt: "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useDeleteMeMutation();

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
      <View className="px-6 pt-6">
        <Text className="mb-6 text-muted-foreground">
          This action is irreversible. Your account and notes will be deleted,
          and other users will no longer have access to your shared notes.
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
              <FormFieldError error={fieldState.error} />
            </View>
          )}
        />
        <FormError error={error} className="mb-4" />
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
