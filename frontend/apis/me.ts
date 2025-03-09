import { tokenDb } from "@/databases/kv";
import type { User } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";
import { Platform } from "react-native";
import * as noteDb from "@/databases/relational/note";

export function useMeQuery() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/me");
    },
  });
}

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    User,
    Error,
    Partial<Omit<User, "id"> & { password: string }>
  >({
    mutationFn: async (data) => {
      return await request.patch("/me", data);
    },
    onSuccess: (me) => {
      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData<User>(["me"], me);
    },
  });
}

export function useDeleteMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await request.delete("/me");
    },
    onSuccess: async () => {
      await tokenDb.remove();

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], null);

      if (Platform.OS !== "web") {
        noteDb.deleteAll();
      }
    },
  });
}
