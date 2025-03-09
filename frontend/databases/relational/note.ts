import type { PublicNote } from "@/utils/types";

export declare function findAll(): PublicNote[];
export declare function findOneById(id: string): PublicNote | null;
export declare function insertOne(note: PublicNote): void;
