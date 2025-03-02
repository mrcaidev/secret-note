import { Platform } from "react-native";
import { create } from "zustand";

const MFA_METHODS = Platform.select({
  native: ["biometric", "email"] as const,
  default: ["email"] as const,
});

type MfaState = {
  passed: boolean;
  method: (typeof MFA_METHODS)[number];
  pass: () => void;
  fallback: () => void;
};

export const useMfaState = create<MfaState>((set, get) => ({
  passed: false,
  method: MFA_METHODS[0],
  pass: () => {
    set({ passed: true });
  },
  fallback: () => {
    const { method } = get();

    // @ts-ignore safe
    const nextMethod = MFA_METHODS[MFA_METHODS.indexOf(method) + 1];

    if (nextMethod) {
      set({ method: nextMethod });
    }
  },
}));
