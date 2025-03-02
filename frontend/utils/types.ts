export type User = {
  id: string;
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
  password: string;
  burn: boolean;
  ttl: number;
  receivers: string[] | null;
  createdAt: string;
  deletedAt: string | null;
};

export type PublicNote = Pick<
  Note,
  "id" | "title" | "content" | "author" | "link" | "createdAt"
>;
