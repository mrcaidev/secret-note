import { useVerifyOtp } from "@/apis/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Text } from "@/components/ui/text";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { View } from "react-native";
import { OtpInput } from "./ui/otp-input";

export function SignUpVerifyOtpScreen() {
  const { mutate, error, isPending } = useVerifyOtp();

  const verifyOtp = (otp: string) => {
    mutate({ otp });
  };

  const email = useOtpFlow((state) => state.email);

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">OTP Verification</Text>
      <Text className="mb-6 text-muted-foreground">
        We have sent a 6-digit One-Time Password to&nbsp;
        <Text>{email ?? "your email"}</Text>&nbsp;to verify your identity.
        Please enter it below.
      </Text>
      <OtpInput disabled={isPending} onFilled={verifyOtp} />
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </View>
  );
}
