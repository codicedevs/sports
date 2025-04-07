// src/features/auth/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { matchService } from "../../../services/matches";
import { Match } from "../../../types/matches.type";
import { axiosBaseQuery } from "../../axiosBaseQuery";
import { ServiceMethods } from "../users";
import { Filter, GetArgs } from "../../../types/store.type";

// interface MatchFilter {
//   _id: string;
// }

// interface LoginResponse {
//   user: { id: string; name: string };
//   access_token: string;
//   refresh_token: string;
// }

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface ApiResponse<T> {
//   data: T;
// }

interface MatchesResponse {
  results: Match[];
  total: number;
}

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: axiosBaseQuery<MatchesResponse>(
    matchService as unknown as ServiceMethods<MatchesResponse>
  ),
  tagTypes: ["Matches"],
  endpoints: (builder) => ({
    getMatches: builder.query<MatchesResponse, Filter>({
      query: (filter: Filter) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Matches"],
    }),
    createMatch: builder.mutation<Match, Match>({
      query: (data) => {
        return {
          url: ``,
          method: "create",
          data,
        };
      },
      invalidatesTags: ["Matches"],
    }),
    deleteMatch: builder.mutation<string, string>({
      query: (matchId) => {
        return {
          url: ``,
          method: "remove",
          data: matchId,
        };
      },
      async onQueryStarted(matchId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          matchApi.util.updateQueryData(
            "getMatches",
            {} as GetArgs,
            (draft) => {
              draft.results = draft.results.filter(
                (match: Match) => match._id !== matchId
              );
            }
          )
        );
        try {
          await queryFulfilled;
          console.log("Partido eliminado:", matchId);
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMatchesQuery,
  useCreateMatchMutation,
  useDeleteMatchMutation,
} = matchApi;
