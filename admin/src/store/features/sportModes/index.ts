// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { sportModeService } from "../../../services/sportModes";
import { SportMode } from "../../../types/sportModes.type";

interface ApiResponse<T> {
  data: T;
}

const axiosBaseQuery =
  <T>(
    service: any
  ): BaseQueryFn<
    {
      url: string;
      method: string;
      data?: any;
      params?: Record<any, any> | string;
    },
    T,
    unknown
  > =>
  async ({ method, data, params }) => {
    try {
      const result: AxiosResponse<T> = await service[method](data, params);

      return { data: result.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const sportModeApi = createApi({
  reducerPath: "sportModeApi",
  baseQuery: axiosBaseQuery<any>(sportModeService),
  tagTypes: ["SportMode"],
  endpoints: (builder) => ({
    getSportMode: builder.query<any, any>({
      query: (filter: any) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["SportMode"],
    }),
    createSportMode: builder.mutation<any, any>({
      query: (data: any) => {
        return {
          url: ``,
          method: "create",
          data,
        };
      },
      invalidatesTags: ["SportMode"],
    }),
    deleteSportMode: builder.mutation<string, string>({
      query: (sportModeId: string) => {
        return {
          url: ``,
          method: "remove",
          data: sportModeId,
        };
      },
      async onQueryStarted(sportModeId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sportModeApi.util.updateQueryData(
            "getSportMode",
            undefined,
            (draft) => {
              draft.results = draft.results.filter(
                (sportMode: SportMode) => sportMode._id !== sportModeId
              );
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetSportModeQuery,
  useCreateSportModeMutation,
  useDeleteSportModeMutation,
  useLazyGetSportModeQuery,
} = sportModeApi;
