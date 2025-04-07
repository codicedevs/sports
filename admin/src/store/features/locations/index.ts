// src/features/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { locationService } from "../../../services/locations";
import { Location } from "../../../types/locations.type";
import { axiosBaseQuery } from "../../axiosBaseQuery";
import { Filter, GetArgs, ServiceMethods } from "../../../types/store.type";

// interface LocationFilter {
//   _id: string;
// }

// interface ApiResponse<T> {
//   data: T;
// }

interface LocationResponse {
  results: Location[];
  totalCount: number;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: axiosBaseQuery<LocationResponse>(
    locationService as unknown as ServiceMethods<LocationResponse>
  ),
  tagTypes: ["Locations"],
  endpoints: (builder) => ({
    getLocations: builder.query<LocationResponse, Filter>({
      query: (filter: Filter) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Locations"],
    }),
    createLocations: builder.mutation<Location, Location>({
      query: (data) => {
        return {
          url: ``,
          method: "create",
          data,
        };
      },
      invalidatesTags: ["Locations"],
    }),
    deleteLocations: builder.mutation<string, string>({
      query: (locationId) => {
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
            {} as GetArgs,
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
  useCreateLocationsMutation,
  useDeleteLocationsMutation,
  useLazyGetLocationsQuery,
} = locationApi;
