export type User = {
  id: string;
  provider: "email" | "google";
  email: string;
  nickname: string;
  avatarUrl: string;
  createdAt: string;
  deletedAt: string | null;
};

export type PublicUser = Pick<User, "id" | "nickname" | "avatarUrl">;

export type Note = {
  id: string;
  title: string;
  content: string;
  author: PublicUser;
  link: string;
  burn: boolean;
  ttl: number;
  receivers: string[];
  createdAt: string;
  deletedAt: string | null;
};

export type PublicNote = Pick<
  Note,
  "id" | "title" | "content" | "author" | "link" | "createdAt"
>;
