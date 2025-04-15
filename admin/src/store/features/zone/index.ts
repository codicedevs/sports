// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { zoneService } from "../../../services/zone";
import { Zone } from "../../../types/zone.type";



interface ZoneFilter {
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

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery: axiosBaseQuery<any>(zoneService),
  tagTypes: ["Zones"],
  endpoints: (builder) => ({
    getZones: builder.query<any, any>({
      query: (filter: any) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Zones"],
    }),
    getZone: builder.query<Zone, any>({
      query: ({ id, populate }) => {
        return {
          url: ``,
          method: "findById",
          data: id,
          params: populate ? { populate } : {},
        };
      },
      providesTags: (result, error, { id }) => [{ type: "Zones", id }],
    }),
    createZones: builder.mutation<any, any>({
      query: (data: any) => {
        return {
          url: ``,
          method: "create",
          data,
        };
      },
      invalidatesTags: ["Zones"],
    }),
    updateZones: builder.mutation<Zone,{zoneId: any; zone: any }>({
      query: ({ zoneId, zone }) => ({
        url: "",
        method: "update",
        data: zoneId,
        params: zone,
      }),
      invalidatesTags: (result, error, { zoneId }) => [
        "Zones",
        { type: "Zones", zoneId },
      ],
    }),

    deleteZones: builder.mutation<string, string>({
      query: (zoneId: any) => {
        return {
          url: ``,
          method: "remove",
          data: zoneId,
        };
      },
      async onQueryStarted(zoneId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          zoneApi.util.updateQueryData(
            "getZones",
            undefined,
            (draft) => {
              draft.results = draft.results.filter(
                (zone: Zone) => zone._id !== zoneId
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
  useGetZonesQuery,
  useGetZoneQuery,
  useCreateZonesMutation,
  useUpdateZonesMutation,
  useDeleteZonesMutation,
  useLazyGetZonesQuery,
} = zoneApi;
