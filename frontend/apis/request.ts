import { tokenStorage } from "@/utils/storage";

export class RequestError extends Error {
  public readonly code: number;

  public constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

type ResponseJson<T> = {
  code: number;
  message: string;
  data: T;
};

async function wrappedFetch<T>(pathname: string, options: RequestInit) {
  if (__DEV__) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const token = await tokenStorage.get();

  const res = await fetch(process.env.EXPO_PUBLIC_API_BASE_URL + pathname, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  const { code, message, data }: ResponseJson<T> = await res.json();

  if (!res.ok || code !== 0) {
    throw new RequestError(code, message);
  }

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
