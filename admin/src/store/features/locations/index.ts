// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { locationService } from "../../../services/locations";
import { Location, NewLocationDto } from "../../../types/locations.type";

interface LocationFilter {
  _id: string;
}

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

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: axiosBaseQuery<any>(locationService),
  tagTypes: ["Locations"],
  endpoints: (builder) => ({
    getLocations: builder.query<any, any>({
      query: (filter: any) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Locations"],
    }),
    getLocation: builder.query<Location, any>({
      query: ({ id, populate }) => {
        return {
          url: ``,
          method: "findById",
          data: id,
          params: populate ? { populate } : {},
        };
      },
    }),
    createLocations: builder.mutation<any, any>({
      query: (data: any) => {
        return {
          url: ``,
          method: "create",
          data,
        };
      },
      invalidatesTags: ["Locations"],
    }),
    updateLocations: builder.mutation<
      Location,
      { locationId: any; location: any }
    >({
      query: ({ locationId, location }) => ({
        url: "",
        method: "update",
        data: locationId,
        params: location,
      }),
      invalidatesTags: ["Locations"],
    }),

    deleteLocations: builder.mutation<string, string>({
      query: (locationId: any) => {
        return {
          url: ``,
          method: "remove",
          data: locationId,
        };
      },
      async onQueryStarted(locationId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          locationApi.util.updateQueryData(
            "getLocations",
            undefined,
            (draft) => {
              draft.results = draft.results.filter(
                (location: Location) => location._id !== locationId
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
  useGetLocationsQuery,
  useGetLocationQuery,
  useCreateLocationsMutation,
  useUpdateLocationsMutation,
  useDeleteLocationsMutation,
  useLazyGetLocationsQuery,
} = locationApi;
