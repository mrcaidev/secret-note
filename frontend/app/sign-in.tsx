import { useSignIn } from "@/apis/auth";
import { OauthGoogleButton } from "@/components/oauth-google-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Link, useRouter } from "expo-router";
import { Loader2Icon, LogInIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as v from "valibot";

const schema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password should be 8-20 characters long"),
    v.maxLength(20, "Password should be 8-20 characters long"),
  ),
});

type Schema = v.InferOutput<typeof schema>;

export default function SignInPage() {
  const { control, handleSubmit } = useForm<Schema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: valibotResolver(schema),
  });

  const router = useRouter();

  const { mutate, error, isPending } = useSignIn();

  const signIn = handleSubmit((data) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  });

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">Sign In</Text>
      <Text className="mb-6 text-muted-foreground">
        Welcome back to Secret Note 👋
      </Text>
      <View className="mb-6">
        <OauthGoogleButton />
      </View>
      <View className="relative mb-6">
        <Separator />
        <Text className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-background text-muted-foreground text-xs">
          OR
        </Text>
      </View>
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
              autoComplete="password"
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
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <Button onPress={signIn} disabled={isPending} className="mb-4">
        {isPending ? (
          <Icon as={Loader2Icon} className="animate-spin" />
        ) : (
          <Icon as={LogInIcon} />
        )}
        <Text>Sign in</Text>
      </Button>
      <Text className="text-sm text-center">
        Doesn&apos;t have an account?&nbsp;
        <Link href="/sign-up" className="underline underline-offset-2">
          Sign up
        </Link>
      </Text>
    </View>
  );
}
