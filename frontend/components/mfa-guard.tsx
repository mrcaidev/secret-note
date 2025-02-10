import { useMfaState } from "@/hooks/use-mfa-state";
import type { PropsWithChildren } from "react";
import { MfaVerifyBioScreen } from "./mfa-verify-bio-screen";
import { MfaVerifyOtpScreen } from "./mfa-verify-otp-screen";

export function MfaGuard({ children }: PropsWithChildren) {
  const passed = useMfaState((state) => state.passed);
  const method = useMfaState((state) => state.method);

  if (passed) {
    return children;
  }

  if (method === "biometric") {
    return <MfaVerifyBioScreen />;
  }

  if (method === "email") {
    return <MfaVerifyOtpScreen />;
  }

  return null;
}
