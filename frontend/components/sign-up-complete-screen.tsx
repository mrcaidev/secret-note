import { useSignUpMutation } from "@/apis/auth";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useRouter } from "expo-router";
import { FlagIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";
import { FormError } from "./form-error";
import { FormFieldError } from "./form-field-error";
import { Spinner } from "./spinner";

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

  const { mutate, error, isPending } = useSignUpMutation();

  const email = useOtpFlow((state) => state.email)!;
  const resetOtpFlow = useOtpFlow((state) => state.reset);

  const router = useRouter();

  const signUp = handleSubmit((data) => {
    mutate(
      { email, ...data },
      {
        onSuccess: () => {
          resetOtpFlow();
          router.push("/");
        },
      },
    );
  });

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">Complete Profile</Text>
      <Text className="mb-6 text-muted-foreground">
        One last step for registration 🚩
      </Text>
      <View className="gap-2 mb-4">
        <Label nativeID="email">Email</Label>
        <Input
          value={email}
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
            <FormFieldError error={fieldState.error} />
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
            <FormFieldError error={fieldState.error} />
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
            <FormFieldError error={fieldState.error} />
          </View>
        )}
      />
      <FormError error={error} className="mb-4" />
      <Button onPress={signUp} disabled={isPending}>
        {isPending ? <Spinner /> : <Icon as={FlagIcon} />}
        <Text>Complete</Text>
      </Button>
    </View>
  );
}
