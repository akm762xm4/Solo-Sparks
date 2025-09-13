import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useAuthStore } from "../store/authStore";

// const baseUrl = "http://localhost:3000/api";
const baseUrl = "https://solo-sparks-three.vercel.app/api";

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

  const result = await fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  })({ ...args, headers }, api, extraOptions);
  
  // Handle 401 Unauthorized errors
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // Clear auth state
    useAuthStore.getState().logout();
    
    // Redirect to auth page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }
  
  return result;
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
