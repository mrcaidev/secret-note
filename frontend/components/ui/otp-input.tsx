import { useTheme } from "@react-navigation/native";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { OtpInput as NativeOtpInput } from "react-native-otp-entry";

export function OtpInput(props: ComponentProps<typeof NativeOtpInput>) {
  const { colors } = useTheme();

  return (
    <View className="max-w-80">
      <NativeOtpInput
        type="numeric"
        focusStickBlinkingDuration={600}
        theme={{
          pinCodeContainerStyle: {
            borderColor: colors.border,
          },
          focusedPinCodeContainerStyle: {
            borderColor: colors.primary,
          },
          pinCodeTextStyle: {
            color: colors.text,
            opacity: props.disabled ? 0.5 : 1,
          },
          focusStickStyle: {
            backgroundColor: colors.primary,
          },
        }}
        {...props}
      />
    </View>
  );
}
