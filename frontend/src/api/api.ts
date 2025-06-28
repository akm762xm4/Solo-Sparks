import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs } from "@reduxjs/toolkit/query";
import { useAuthStore } from "../store/authStore";

const baseUrl = "http://localhost:5000/api";
// const baseUrl = "http://localhost:5000/api";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: any,
  extraOptions: any
) => {
  // Get token from Zustand store
  const token = useAuthStore.getState().token;
  let baseHeaders: Record<string, string> = {};

  if (typeof args === "string") {
    args = { url: args };
  }

  if (args.headers instanceof Headers) {
    args.headers.forEach((value, key) => {
      baseHeaders[key] = value;
    });
  } else if (args.headers) {
    baseHeaders = { ...args.headers } as Record<string, string>;
  }

  if (token) {
    baseHeaders["Authorization"] = `Bearer ${token}`;
  }

  const headers = baseHeaders;

  return fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  })({ ...args, headers }, api, extraOptions);
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Upload",
    "Reflection",
    "Profile",
    "Quest",
    "Rewards",
    "Redemptions",
  ],
});
