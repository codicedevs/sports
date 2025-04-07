import { sportService } from "../../../services/sports";
import { NewSportDto, Sport } from "../../../types/sport.type";
import { axiosBaseQuery } from "../../axiosBaseQuery";
import { Filter, GetArgs, ServiceMethods } from "../../../types/store.type";
import { createApi } from "@reduxjs/toolkit/query/react";

interface SportResponse {
  results: Sport[];
  totalCount: number;
}

export const sportApi = createApi({
  reducerPath: "sportApi",
  baseQuery: axiosBaseQuery<SportResponse>(
    sportService as unknown as ServiceMethods<SportResponse>
  ),
  tagTypes: ["Sports"],
  endpoints: (builder) => ({
    getSports: builder.query<SportResponse, Filter | void>({
      query: (filter?: Filter) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Sports"],
    }),

    getSport: builder.query<Sport, GetArgs>({
      query: ({ id, populate }) => {
        return {
          url: ``,
          method: "findById",
          data: id,
          params: populate ? { populate } : {},
        };
      },
    }),

    createSport: builder.mutation<NewSportDto, NewSportDto>({
      query: (sport: Sport) => ({
        url: "",
        method: "create",
        data: sport,
      }),
      invalidatesTags: ["Sports"],
    }),

    updateSport: builder.mutation<Sport, { sportId: string; sport: Sport }>({
      query: ({ sportId, sport }) => ({
        url: "",
        method: "update",
        data: sportId,
        params: sport,
      }),
      invalidatesTags: ["Sports"],
    }),

    deleteSport: builder.mutation<string, string>({
      query: (sportId: string) => ({
        url: "", // <- poné la URL correspondiente
        method: "remove", // <- usá "delete" si tu backend lo requiere así
        data: sportId,
      }),
      async onQueryStarted(sportId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          sportApi.util.updateQueryData("getSports", undefined, (draft) => {
            draft.results = draft.results.filter(
              (sport: Sport) => sport._id !== sportId
            );
          })
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
  useGetSportsQuery,
  useGetSportQuery,
  useCreateSportMutation,
  useUpdateSportMutation,
  useDeleteSportMutation,
} = sportApi;
