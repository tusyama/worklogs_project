import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  EntriesListQuery,
  ItemResponse,
  ItemsResponse,
  WorkEntryCreate,
  WorkEntryDto,
  WorkEntryUpdate,
  WorkTypeDto,
} from "@worklog/shared";

const baseUrl = import.meta.env.VITE_API_URL ?? "/api";

export const worklogApi = createApi({
  reducerPath: "worklogApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["WorkType", "Entry"],
  endpoints: (builder) => ({
    getWorkTypes: builder.query<WorkTypeDto[], void>({
      query: () => "/work-types",
      transformResponse: (res: ItemsResponse<WorkTypeDto>) => res.items,
      providesTags: ["WorkType"],
    }),
    getEntries: builder.query<WorkEntryDto[], EntriesListQuery>({
      query: (params) => ({
        url: "/entries",
        params,
      }),
      transformResponse: (res: ItemsResponse<WorkEntryDto>) => res.items,
      providesTags: (_result, _err, arg) => [{ type: "Entry", id: JSON.stringify(arg) }],
    }),
    createEntry: builder.mutation<WorkEntryDto, WorkEntryCreate>({
      query: (body) => ({
        url: "/entries",
        method: "POST",
        body,
      }),
      transformResponse: (res: ItemResponse<WorkEntryDto>) => res.item,
      invalidatesTags: [{ type: "Entry" }],
    }),
    updateEntry: builder.mutation<WorkEntryDto, { id: string; body: WorkEntryUpdate }>({
      query: ({ id, body }) => ({
        url: `/entries/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (res: ItemResponse<WorkEntryDto>) => res.item,
      invalidatesTags: [{ type: "Entry" }],
    }),
    deleteEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/entries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Entry" }],
    }),
  }),
});

export const {
  useGetWorkTypesQuery,
  useGetEntriesQuery,
  useCreateEntryMutation,
  useUpdateEntryMutation,
  useDeleteEntryMutation,
} = worklogApi;
