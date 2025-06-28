import { api } from "./api";
import type { UploadResponse, ApiResponse } from "../types";

export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<ApiResponse<UploadResponse>, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
    }),
    getUploads: builder.query<ApiResponse<UploadResponse[]>, void>({
      query: () => "/upload",
      providesTags: ["Upload"],
    }),
    deleteUpload: builder.mutation<void, string>({
      query: (id) => ({
        url: `/upload/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetUploadsQuery,
  useDeleteUploadMutation,
} = uploadApi;
