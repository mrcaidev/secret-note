import { useSendOtp, useVerifyOtp } from "@/apis/auth";
import { useMe } from "@/apis/me";
import { useMfaState } from "@/hooks/use-mfa-state";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { useEffect } from "react";
import { View } from "react-native";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { OtpInput } from "./ui/otp-input";
import { Text } from "./ui/text";

export function MfaVerifyOtpScreen() {
  const passMfa = useMfaState((state) => state.pass);

  const { data: me } = useMe();

  const { mutate: sendOtp, error: sendOtpError } = useSendOtp();

  // biome-ignore lint/correctness/useExhaustiveDependencies: only once
  useEffect(() => {
    sendOtp({ email: me!.email });
  }, []);

  const {
    mutate: verifyOtp,
    error: verifyOtpError,
    isPending: isVerifyingOtp,
  } = useVerifyOtp();

  const error = sendOtpError || verifyOtpError;

  const resetOtpFlow = useOtpFlow((state) => state.reset);

  const tryMfa = (otp: string) => {
    verifyOtp(
      { otp },
      {
        onSuccess: () => {
          passMfa();
          resetOtpFlow();
        },
      },
    );
  };

  if (!me) {
    return null;
  }

  return (
    <View className="grow justify-center px-12">
      <Text className="mb-3 text-3xl font-bold">OTP Verification</Text>
      <Text className="mb-6 text-muted-foreground">
        Multi-Factor Authentication (MFA) is enabled for your account. Please
        enter below the 6-digit One-Time Password (OTP) sent to&nbsp;
        <Text>{me.email}</Text> before continuing to access sensitive data or
        operations.
      </Text>
      <OtpInput disabled={isVerifyingOtp} onFilled={tryMfa} />
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </View>
  );
}
