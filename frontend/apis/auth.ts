import { tokenDb } from "@/databases/kv";
import { useNoteDb } from "@/databases/relational/note";
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
      await tokenDb.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignInWithEmailMutation() {
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
      await tokenDb.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignInWithOauthMutation(provider: string) {
  const queryClient = useQueryClient();

  return useMutation<User & { token: string }, Error, { accessToken: string }>({
    mutationFn: async (data) => {
      return await request.post(`/oauth/${provider}/token`, data);
    },
    onSuccess: async ({ token, ...me }) => {
      await tokenDb.set(token);

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], me);
    },
  });
}

export function useSignOutMutation() {
  const noteDb = useNoteDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await request.delete("/auth/token");
    },
    onSuccess: async () => {
      await tokenDb.remove();

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["me"] });

      queryClient.removeQueries({ queryKey: ["notes"] });

      await noteDb.deleteAll();
    },
  });
}
