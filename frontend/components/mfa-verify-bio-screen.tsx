import { useMfaState } from "@/hooks/use-mfa-state";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "./ui/text";

export function MfaVerifyBioScreen() {
  const passMfa = useMfaState((state) => state.pass);
  const fallbackMfa = useMfaState((state) => state.fallback);

  const bioAuthenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      fallbackMfa();
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      fallbackMfa();
      return;
    }

    const { success } = await LocalAuthentication.authenticateAsync();

    if (!success) {
      return;
    }

    passMfa();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: only once
  useEffect(() => {
    bioAuthenticate();
  }, []);

  return (
    <View className="grow justify-center px-12">
      <Text className="mb-3 text-3xl font-bold">Bio Verification</Text>
      <Text className="text-muted-foreground">
        Multi-Factor Authentication (MFA) is enabled for your account. Please
        verify your biometric information in the pop-up window before continuing
        to access sensitive data or operations.
      </Text>
    </View>
  );
}
