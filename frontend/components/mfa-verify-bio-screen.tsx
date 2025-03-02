import { useMfaState } from "@/hooks/use-mfa-state";
import * as LocalAuthentication from "expo-local-authentication";
import { RotateCwIcon } from "lucide-react-native";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

export function MfaVerifyBioScreen() {
  const passMfa = useMfaState((state) => state.pass);
  const fallbackMfa = useMfaState((state) => state.fallback);

  const verifyBio = useCallback(async () => {
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
  }, [fallbackMfa, passMfa]);

  useEffect(() => {
    verifyBio();
  }, [verifyBio]);

  return (
    <View className="grow justify-center px-12 bg-background">
      <Text className="mb-3 text-3xl font-bold">Biometric Verification</Text>
      <Text className="mb-6 text-muted-foreground">
        Multi-Factor Authentication (MFA) is enabled for your account. Please
        verify your biometric information in the pop-up window before continuing
        to access sensitive data or operations.
      </Text>
      <Button onPress={verifyBio}>
        <Icon as={RotateCwIcon} />
        <Text>Try again</Text>
      </Button>
    </View>
  );
}
