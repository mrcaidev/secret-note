import { NoteDb } from "@/databases/relational/note";
import { useSqlite } from "@/providers/sqlite-provider";
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

  const db = useSqlite();

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
            pages: [{ notes: new NoteDb(db).findAll(), nextCursor: "" }],
            pageParams: [""],
          },
  });
}

export function useNoteQuery(id: string, password?: string) {
  const db = useSqlite();

  return useQuery<PublicNote>({
    queryKey: ["note", id],
    queryFn: async () => {
      return await request.get(
        `/notes/${id}${password ? `?password=${password}` : ""}`,
      );
    },
    placeholderData:
      Platform.OS === "web"
        ? undefined
        : (new NoteDb(db).findOneById(id) ?? undefined),
  });
}

export function useCreateNoteMutation() {
  const db = useSqlite();
  const queryClient = useQueryClient();

  return useMutation<
    Note,
    Error,
    Pick<Note, "title" | "content" | "password" | "burn" | "ttl" | "receivers">
  >({
    mutationFn: async (data) => {
      return await request.post("/notes", data);
    },
    onSuccess: async (note) => {
      queryClient.setQueryData<Note>(["note", note.id], note);
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (Platform.OS !== "web") {
        await new NoteDb(db).insertOne(note);
      }
    },
  });
}

export function useDeleteNoteMutation() {
  const db = useSqlite();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await request.delete(`/notes/${id}`);
    },
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      if (Platform.OS !== "web") {
        await new NoteDb(db).deleteOneById(id);
      }
    },
  });
}
