import { tokenDb } from "@/databases/kv";
import { useNoteDb } from "@/databases/relational/note";
import type { User } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useMeQuery() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/me");
    },
  });
}

export function useDeleteMeMutation() {
  const noteDb = useNoteDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await request.delete("/me");
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
