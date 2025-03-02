import { useVerifyOtpMutation } from "@/apis/auth";
import { Text } from "@/components/ui/text";
import { useOtpFlow } from "@/hooks/use-otp-flow";
import { View } from "react-native";
import { FormError } from "./form-error";
import { OtpInput } from "./ui/otp-input";

export function SignUpVerifyOtpScreen() {
  const { mutate, error, isPending } = useVerifyOtpMutation();

  const otpFlowId = useOtpFlow((state) => state.id)!;
  const email = useOtpFlow((state) => state.email)!;
  const completeOtpFlow = useOtpFlow((state) => state.complete);

  const verifyOtp = (otp: string) => {
    mutate(
      { otpFlowId, otp },
      {
        onSuccess: () => {
          completeOtpFlow();
        },
      },
    );
  };

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">OTP Verification</Text>
      <Text className="mb-6 text-muted-foreground">
        We have sent a 6-digit One-Time Password to&nbsp;
        <Text>{email}</Text>&nbsp;to verify your identity. Please enter it
        below.
      </Text>
      <OtpInput onFilled={verifyOtp} disabled={isPending} />
      <FormError error={error} className="mt-4" />
    </View>
  );
}
