import { useSendOtpMutation, useVerifyOtpMutation } from "@/apis/auth";
import { useMe } from "@/apis/me";
import { useMfaState } from "@/hooks/use-mfa-state";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { useEffect } from "react";
import { View } from "react-native";
import { FormError } from "./form-error";
import { OtpInput } from "./ui/otp-input";
import { Text } from "./ui/text";

export function MfaVerifyOtpScreen() {
  const { data: me } = useMe();

  const otpFlowId = useOtpFlow((state) => state.id);
  const startOtpFlow = useOtpFlow((state) => state.start);
  const resetOtpFlow = useOtpFlow((state) => state.reset);

  const passMfa = useMfaState((state) => state.pass);

  const { mutate: sendOtpMutate, error: sendOtpError } = useSendOtpMutation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: only once
  useEffect(() => {
    sendOtpMutate(
      { email: me!.email },
      {
        onSuccess: (otpFlowId, { email }) => {
          startOtpFlow({ id: otpFlowId, email });
        },
      },
    );
  }, []);

  const {
    mutate: verifyOtpMutate,
    error: verifyOtpError,
    isPending,
  } = useVerifyOtpMutation();

  const verifyOtp = (otp: string) => {
    if (!otpFlowId) {
      return;
    }

    verifyOtpMutate(
      { otpFlowId, otp },
      {
        onSuccess: () => {
          resetOtpFlow();
          passMfa();
        },
      },
    );
  };

  const error = sendOtpError || verifyOtpError;

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
      <OtpInput disabled={isPending} onFilled={verifyOtp} />
      <FormError error={error} className="mt-4" />
    </View>
  );
}
