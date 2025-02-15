import { useMfaState } from "@/hooks/use-mfa-state";
import type { PropsWithChildren } from "react";
import { MfaVerifyBioScreen } from "./mfa-verify-bio-screen";
import { MfaVerifyOtpScreen } from "./mfa-verify-otp-screen";

export function MfaGuard({ children }: PropsWithChildren) {
  const mfaPassed = useMfaState((state) => state.passed);
  const mfaMethod = useMfaState((state) => state.method);

  if (mfaPassed) {
    return children;
  }

  if (mfaMethod === "biometric") {
    return <MfaVerifyBioScreen />;
  }

  return <MfaVerifyOtpScreen />;
}
