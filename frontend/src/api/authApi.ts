import { api } from "./api";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  ApiResponse,
} from "../types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<User>, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<ApiResponse<User>, RegisterCredentials>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;
