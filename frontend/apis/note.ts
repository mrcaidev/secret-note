import type { Note, PublicNote } from "@/utils/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "./request";

export function useNotes() {
  return useQuery<Omit<PublicNote, "content">[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      return await request.get("/notes?limit=10");
    },
  });
}

export function useNote(id: string) {
  return useQuery<PublicNote>({
    queryKey: ["note", id],
    queryFn: async () => {
      return await request.get(`/notes/${id}`);
    },
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, Error, Pick<Note, "title" | "content">>({
    mutationFn: async (data) => {
      return await request.post("/notes", data);
    },
    onSuccess: (note) => {
      queryClient.setQueryData<Omit<Note, "content">[]>(["notes"], (old) =>
        old ? [note, ...old] : [note],
      );
    },
  });
}
