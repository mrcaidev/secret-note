import { useSendOtpMutation, useVerifyOtpMutation } from "@/apis/auth";
import { useMeQuery } from "@/apis/me";
import { useMfaState } from "@/hooks/use-mfa-state";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { useEffect } from "react";
import { View } from "react-native";
import { FormError } from "./form-error";
import { OtpInput } from "./ui/otp-input";
import { Text } from "./ui/text";

export function MfaVerifyOtpScreen() {
  const { data: me } = useMeQuery();
  const email = me!.email;

  const otpFlowId = useOtpFlow((state) => state.id);
  const startOtpFlow = useOtpFlow((state) => state.start);
  const resetOtpFlow = useOtpFlow((state) => state.reset);

  const passMfa = useMfaState((state) => state.pass);

  const {
    mutate: sendOtpMutate,
    error: sendOtpError,
    isPending: isSendOtpPending,
  } = useSendOtpMutation();

  useEffect(() => {
    sendOtpMutate(
      { email },
      {
        onSuccess: (otpFlowId, { email }) => {
          startOtpFlow({ id: otpFlowId, email });
        },
      },
    );
  }, [email, sendOtpMutate, startOtpFlow]);

  const {
    mutate: verifyOtpMutate,
    error: verifyOtpError,
    isPending: isVerifyOtpPending,
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
  const isPending = isSendOtpPending || isVerifyOtpPending;

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">OTP Verification</Text>
      <Text className="mb-6 text-muted-foreground">
        Multi-Factor Authentication (MFA) is enabled for your account. Please
        enter below the 6-digit One-Time Password (OTP) sent to&nbsp;
        <Text>{email}</Text>&nbsp;before continuing to access sensitive data or
        operations.
      </Text>
      <OtpInput onFilled={verifyOtp} disabled={isPending} />
      <FormError error={error} className="mt-4" />
    </View>
  );
}
