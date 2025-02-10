import { SignUpCompleteScreen } from "@/components/sign-up-complete-screen";
import { SignUpSendOtpScreen } from "@/components/sign-up-send-otp-screen";
import { SignUpVerifyOtpScreen } from "@/components/sign-up-verify-otp-screen";
import { useOtpFlow } from "@/hooks/use-otp-flow";

export default function SignUpPage() {
  const otpFlowStatus = useOtpFlow((state) => state.status);

  if (otpFlowStatus === "idle") {
    return <SignUpSendOtpScreen />;
  }

  if (otpFlowStatus === "pending") {
    return <SignUpVerifyOtpScreen />;
  }

  return <SignUpCompleteScreen />;
}
