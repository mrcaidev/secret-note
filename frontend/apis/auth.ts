import { useOtpFlow } from "@/hooks/use-otp-flow";
import { tokenStorage } from "@/utils/storage";
import type { User } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useSendOtp() {
  const startOtpFlow = useOtpFlow((state) => state.start);

  return useMutation<{ otpFlowId: string }, Error, { email: string }>({
    mutationFn: async (data) => {
      return await request.post("/auth/otp/send", data);
    },
    onSuccess: ({ otpFlowId }, { email }) => {
      startOtpFlow({ id: otpFlowId, email });
    },
  });
}

export function useVerifyOtp() {
  const otpFlowId = useOtpFlow((state) => state.id);
  const completeOtpFlow = useOtpFlow((state) => state.complete);

  return useMutation<null, Error, { otp: string }>({
    mutationFn: async (data) => {
      return await request.post("/auth/otp/verify", { otpFlowId, ...data });
    },
    onSuccess: () => {
      completeOtpFlow();
    },
  });
}

export function useSignUp() {
  const email = useOtpFlow((state) => state.email);
  const resetOtpFlow = useOtpFlow((state) => state.reset);

  const queryClient = useQueryClient();

  return useMutation<
    User & { token: string },
    Error,
    { password: string; nickname: string }
  >({
    mutationFn: async (data) => {
      return await request.post("/users", { email, ...data });
    },
    onSuccess: async ({ token, ...me }) => {
      resetOtpFlow();

      await tokenStorage.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation<
    User & { token: string },
    Error,
    { email: string; password: string }
  >({
    mutationFn: async (data) => {
      return await request.post("/auth/token", data);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStorage.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await request.delete("/auth/token");
    },
    onSuccess: async () => {
      await tokenStorage.remove();

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], null);
    },
  });
}
