import { api } from "./api";

export interface Reflection {
  _id: string;
  questTitle: string;
  questType: string;
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  qualityScore?: number;
  createdAt: string;
}

export const reflectionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitReflection: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/reflections",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Reflection"],
    }),
    getReflections: builder.query<Reflection[], void>({
      query: () => "/reflections",
      providesTags: ["Reflection", "Quest"],
      // You may want to add providesTags for cache invalidation
    }),
    deleteReflection: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reflections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reflection"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSubmitReflectionMutation,
  useGetReflectionsQuery,
  useDeleteReflectionMutation,
} = reflectionApi;
