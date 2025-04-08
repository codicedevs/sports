import { AxiosError, AxiosResponse } from "axios";
import { sportService } from "../../../services/sports";
import { NewSportDto, Sport } from "../../../types/sport.type";
import { createApi } from "@reduxjs/toolkit/query/react";

interface SportResponse {
  results: Sport[];
  totalCount: number;
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

export const sportApi = createApi({
  reducerPath: "sportApi",
  baseQuery: axiosBaseQuery<SportResponse>(sportService),
  tagTypes: ["Sports"],
  endpoints: (builder) => ({
    getSports: builder.query<SportResponse, any | void>({
      query: (filter?: any) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Sports"],
    }),

    getSport: builder.query<Sport, any>({
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
