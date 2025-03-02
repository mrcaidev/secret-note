import * as NoteDb from "@/databases/rdbms/note";
import type { Note, PublicNote } from "@/utils/types";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Platform } from "react-native";
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
    placeholderData:
      Platform.OS === "web"
        ? undefined
        : {
            pages: [{ notes: NoteDb.findAll(), nextCursor: "" }],
            pageParams: [],
          },
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
    placeholderData:
      Platform.OS === "web" ? undefined : (NoteDb.findOneById(id) ?? undefined),
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
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      if (Platform.OS !== "web") {
        NoteDb.insertOne(note);
      }
    },
  });
}
