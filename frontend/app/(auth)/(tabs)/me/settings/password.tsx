import { useUpdateMe } from "@/apis/me";
import { ErrorAlert } from "@/components/error-alert";
import { MfaGuard } from "@/components/mfa-guard";
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

const schema = v.pipe(
  v.object({
    password: v.pipe(
      v.string(),
      v.minLength(8, "Password should be 8-20 characters long"),
      v.maxLength(20, "Password should be 8-20 characters long"),
    ),
    confirmPassword: v.pipe(
      v.string(),
      v.minLength(8, "Password should be 8-20 characters long"),
      v.maxLength(20, "Password should be 8-20 characters long"),
    ),
  }),
  v.forward(
    v.check(
      ({ password, confirmPassword }) => password === confirmPassword,
      "Passwords do not match",
    ),
    ["confirmPassword"],
  ),
);

type Schema = v.InferOutput<typeof schema>;

export default function PasswordSettingPage() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useUpdateMe();

  const router = useRouter();

  const updatePassword = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/me/settings");
      },
    });
  });

  return (
    <MfaGuard>
      <View className="px-6 pt-28">
        <Text className="mb-6 text-muted-foreground">
          Password will be used as the primary way of authentication.
        </Text>
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <View className="gap-2 mb-4">
              <Label nativeID="password">New Password</Label>
              <Input
                {...field}
                secureTextEntry
                onChangeText={field.onChange}
                placeholder="8-20 characters"
                autoComplete="password-new"
                aria-labelledby="password"
              />
              {fieldState.error && (
                <Text className="text-destructive text-sm">
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field, fieldState }) => (
            <View className="gap-2 mb-4">
              <Label nativeID="confirmPassword">Confirm Password</Label>
              <Input
                {...field}
                secureTextEntry
                onChangeText={field.onChange}
                placeholder="Type new password again"
                autoComplete="off"
                aria-labelledby="confirmPassword"
              />
              {fieldState.error && (
                <Text className="text-destructive text-sm">
                  {fieldState.error.message}
                </Text>
              )}
            </View>
          )}
        />
        {error && <ErrorAlert description={error.message} className="mb-4" />}
        <Button onPress={updatePassword} disabled={isPending}>
          {isPending ? <Spinner /> : <Icon as={SaveIcon} />}
          <Text>Update</Text>
        </Button>
      </View>
    </MfaGuard>
  );
}
