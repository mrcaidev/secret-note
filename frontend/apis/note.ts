import { useNoteDb } from "@/databases/relational/note";
import type { Note, PublicNote } from "@/utils/types";
import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { request } from "./request";

export function useNotesInfiniteQuery() {
  type Data = {
    notes: Omit<PublicNote, "content">[];
    nextCursor: string;
  };

  const noteDb = useNoteDb();

  const result = useInfiniteQuery<
    Data,
    Error,
    InfiniteData<Data>,
    string[],
    string
  >({
    queryKey: ["notes"],
    queryFn: async ({ pageParam: cursor }) => {
      const searchParams = new URLSearchParams({ limit: "10", cursor });
      return await request.get(`/notes?${searchParams}`);
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor || null,
    placeholderData: {
      pages: [{ notes: noteDb.findAll(), nextCursor: "" }],
      pageParams: [""],
    },
  });

  useEffect(() => {
    if (result.data) {
      noteDb.upsertMany(
        result.data.pages.flatMap((page) =>
          page.notes.map((note) => ({ ...note, content: "", link: "" })),
        ),
      );
    }
  }, [noteDb, result.data]);

  return result;
}

export function useNoteQuery(id: string) {
  const noteDb = useNoteDb();

  const result = useQuery<PublicNote>({
    queryKey: ["note", id],
    queryFn: async () => {
      return await request.get(`/notes/${id}`);
    },
    placeholderData: noteDb.findOneById(id) ?? undefined,
  });

  useEffect(() => {
    if (result.data) {
      noteDb.upsertOne(result.data);
    }
  }, [noteDb, result.data]);

  return result;
}

export function useCreateNoteMutation() {
  const noteDb = useNoteDb();
  const queryClient = useQueryClient();

  return useMutation<
    Note,
    Error,
    Pick<Note, "title" | "content" | "burn" | "ttl" | "receivers">
  >({
    mutationFn: async (data) => {
      return await request.post<Note>("/notes", { ...data, password: "" });
    },
    onSuccess: async (note) => {
      queryClient.setQueryData<Note>(["note", note.id], note);
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      await noteDb.upsertOne(note);
    },
  });
}

export function useDeleteNoteMutation() {
  const noteDb = useNoteDb();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await request.delete(`/notes/${id}`);
    },
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      await noteDb.deleteOneById(id);
    },
  });
}
