import { tokenStorage } from "@/utils/storage";
import type { User } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useMe() {
  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      return await request.get("/me");
    },
  });
}

export function useUpdateMe() {
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

export function useDeleteMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await request.delete("/me");
    },
    onSuccess: async () => {
      await tokenStorage.remove();

      queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.setQueryData(["me"], null);
    },
  });
}
