import { useUpdateMeMutation } from "@/apis/me";
import { FormError } from "@/components/form-error";
import { FormFieldError } from "@/components/form-field-error";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { SaveIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
});

type Schema = v.InferOutput<typeof schema>;

export default function EmailSettingPage() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      email: "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useUpdateMeMutation();

  const router = useRouter();

  const updateEmail = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/me/settings");
      },
    });
  });

  return (
    <View className="px-6 pt-28">
      <Text className="mb-6 text-muted-foreground">
        Email will be used for authentication, password recovery, notifications,
        etc.
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <View className="gap-2 mb-4">
            <Label nativeID="email">New Email</Label>
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-labelledby="email"
            />
            <FormFieldError error={fieldState.error} />
          </View>
        )}
      />
      <FormError error={error} className="mb-4" />
      <Button onPress={updateEmail} disabled={isPending}>
        {isPending ? <Spinner /> : <Icon as={SaveIcon} />}
        <Text>Update</Text>
      </Button>
    </View>
  );
}
