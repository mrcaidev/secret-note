import { useSignUp } from "@/apis/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { FlagIcon, Loader2Icon } from "lucide-react-native";
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
    nickname: v.pipe(
      v.string(),
      v.minLength(2, "Nickname should be 2-20 characters long"),
      v.maxLength(20, "Nickname should be 2-20 characters long"),
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

export function SignUpCompleteScreen() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      password: "",
      confirmPassword: "",
      nickname: "",
    },
    resolver: valibotResolver(schema),
  });

  const router = useRouter();

  const { mutate, error, isPending } = useSignUp();

  const completeSignUp = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  });

  const email = useOtpFlow((state) => state.email);

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">Complete Profile</Text>
      <Text className="mb-6 text-muted-foreground">
        One last step for registration 🚩
      </Text>
      <View className="gap-2 mb-4">
        <Label nativeID="email">Email</Label>
        <Input
          value={email ?? "Unknown email"}
          editable={false}
          readOnly
          aria-labelledby="email"
        />
      </View>
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <View className="gap-2 mb-4">
            <Label nativeID="password">Password</Label>
            <Input
              {...field}
              onChangeText={field.onChange}
              secureTextEntry
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
              onChangeText={field.onChange}
              secureTextEntry
              placeholder="Type your password again"
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
      <Button onPress={completeSignUp} disabled={isPending}>
        {isPending ? (
          <Icon as={Loader2Icon} className="animate-spin" />
        ) : (
          <Icon as={FlagIcon} />
        )}
        <Text>Complete</Text>
      </Button>
    </View>
  );
}
