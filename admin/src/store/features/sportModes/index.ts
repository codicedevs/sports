// src/features/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { sportModeService } from "../../../services/sportModes";
import { SportMode, SportModeDto } from "../../../types/sportModes.type";
import { axiosBaseQuery } from "../../axiosBaseQuery";
import { Filter, GetArgs, ServiceMethods } from "../../../types/store.type";

// interface ApiResponse<T> {
//   data: T;
// }
interface SportModeResponse {
  results: SportMode[];
  totalCount: number;
}

export const sportModeApi = createApi({
  reducerPath: "sportModeApi",
  baseQuery: axiosBaseQuery<SportModeResponse>(
    sportModeService as unknown as ServiceMethods<SportModeResponse>
  ),
  tagTypes: ["SportMode"],
  endpoints: (builder) => ({
    getSportMode: builder.query<SportModeResponse, GetArgs>({
      query: (filter: Filter) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["SportMode"],
    }),
    createSportMode: builder.mutation<SportMode, SportModeDto>({
      query: (data: SportModeDto) => {
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
            {} as GetArgs,
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
