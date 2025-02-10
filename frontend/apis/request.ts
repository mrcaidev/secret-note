import { tokenStorage } from "@/utils/storage";

export class RequestError extends Error {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function wrappedFetch<T>(pathname: string, options: RequestInit) {
  const token = await tokenStorage.get();

  const res = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL + pathname, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (res.status === 204) {
    return null as unknown as T;
  }

  if (!res.ok) {
    const { error }: { error: string } = await res.json();
    throw new RequestError(res.status, error);
  }

  const data: T = await res.json();
  return data;
}

export const request = {
  get: async <T>(pathname: string, options: RequestInit = {}) => {
    return await wrappedFetch<T>(pathname, { method: "GET", ...options });
  },

  post: async <T>(
    pathname: string,
    data: unknown = {},
    options: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "POST",
      body: JSON.stringify(data),
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  },

  put: async <T>(
    pathname: string,
    data: unknown = {},
    options: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "PUT",
      body: JSON.stringify(data),
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  },

  patch: async <T>(
    pathname: string,
    data: unknown = {},
    options: RequestInit = {},
  ) => {
    return await wrappedFetch<T>(pathname, {
      method: "PATCH",
      body: JSON.stringify(data),
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  },

  delete: async <T>(pathname: string, options: RequestInit = {}) => {
    return await wrappedFetch<T>(pathname, { method: "DELETE", ...options });
  },
};
