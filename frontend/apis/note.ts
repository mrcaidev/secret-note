import type { Note, PublicNote } from "@/utils/types";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { request } from "./request";

export function useNotesInfiniteQuery() {
  type Data = {
    notes: Omit<PublicNote, "content">[];
    nextCursor: string;
  };

  return useInfiniteQuery<Data, Error, InfiniteData<Data>, string[], string>({
    queryKey: ["notes"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({ limit: "10", cursor });
      return await request.get(`/notes?${searchParams}`);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
  });
}

export function useNoteQuery(id: string, password?: string) {
  return useQuery<PublicNote>({
    queryKey: ["note", id],
    queryFn: async () => {
      return await request.get(
        `/notes/${id}${password ? `?password=${password}` : ""}`,
      );
    },
  });
}

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    Note,
    Error,
    Pick<Note, "title" | "content" | "password" | "burn" | "ttl" | "receivers">
  >({
    mutationFn: async (data) => {
      return await request.post("/notes", data);
    },
    onSuccess: (note) => {
      queryClient.setQueryData<Note>(["note", note.id], note);
      queryClient.setQueryData<Omit<Note, "content">[]>(["notes"], (old) =>
        old ? [note, ...old] : [note],
      );
    },
  });
}
