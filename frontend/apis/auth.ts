import { tokenStorage } from "@/utils/storage";
import type { User } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useSendOtpMutation() {
  return useMutation<string, Error, { email: string }>({
    mutationFn: async (data) => {
      return await request.post("/auth/otp/send", data);
    },
  });
}

export function useVerifyOtpMutation() {
  return useMutation<null, Error, { otpFlowId: string; otp: string }>({
    mutationFn: async (data) => {
      return await request.post("/auth/otp/verify", data);
    },
  });
}

export function useSignUpMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    User & { token: string },
    Error,
    { email: string; password: string; nickname: string }
  >({
    mutationFn: async (data) => {
      return await request.post("/users", data);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenStorage.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignInMutation() {
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

export function useSignInWithOauth(provider: string) {
  const queryClient = useQueryClient();

  return useMutation<User & { token: string }, Error, { accessToken: string }>({
    mutationFn: async (data) => {
      return await request.post("/oauth/token", { provider, ...data });
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
