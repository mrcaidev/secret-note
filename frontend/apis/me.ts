import { tokenDb } from "@/databases/kv";
import { NoteDb } from "@/databases/relational/note";
import { useSqlite } from "@/providers/sqlite-provider";
import type { User } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import { request } from "./request";

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
  const db = useSqlite();
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
        await new NoteDb(db).deleteAll();
      }
    },
  });
}
