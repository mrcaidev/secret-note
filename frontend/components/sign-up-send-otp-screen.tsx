import { useSendOtp } from "@/apis/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link } from "expo-router";
import { Loader2Icon, MailIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
});

type Schema = v.InferOutput<typeof schema>;

export function SignUpSendOtpScreen() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      email: "",
    },
    resolver: valibotResolver(schema),
  });

  const { mutate, error, isPending } = useSendOtp();

  const sendOtp = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">Sign Up</Text>
      <Text className="mb-6 text-muted-foreground">
        Start your journey on Secret Note 🚀
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <View className="gap-2 mb-4">
            <Label nativeID="email">Email</Label>
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-labelledby="email"
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
      <Button onPress={sendOtp} disabled={isPending} className="mb-4">
        {isPending ? (
          <Icon as={Loader2Icon} className="animate-spin" />
        ) : (
          <Icon as={MailIcon} />
        )}
        <Text>Send OTP</Text>
      </Button>
      <Text className="text-sm text-center">
        Already have an account?&nbsp;
        <Link href="/sign-in" className="underline underline-offset-2">
          Sign in
        </Link>
      </Text>
    </View>
  );
}
