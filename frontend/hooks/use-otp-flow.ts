import { create } from "zustand";

type OtpFlow = {
  status: "idle" | "pending" | "success";
  id: string | null;
  email: string | null;
  start: (payload: { id: string; email: string }) => void;
  complete: () => void;
  reset: () => void;
};

export const useOtpFlow = create<OtpFlow>()((set) => ({
  status: "idle" as const,
  id: null,
  email: null,
  start: (payload) => {
    set({ status: "pending", ...payload });
  },
  complete: () => {
    set({ status: "success" });
  },
  reset: () => {
    set({ status: "idle", id: null, email: null });
  },
}));
