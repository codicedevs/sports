// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { matchService } from "../../../services/match";

interface MatchFilter {
  _id: string;
}

interface LoginResponse {
  user: { id: string; name: string };
  access_token: string;
  refresh_token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  data: T;
}

const axiosBaseQuery =
  <T>(
    service: any
  ): BaseQueryFn<
    { url: string; method: string; data?: any; params?: Record<any, any> },
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

export const matchApi = createApi({
  reducerPath: "matchApi",
  baseQuery: axiosBaseQuery<ApiResponse<any>>(matchService),
  endpoints: (builder) => ({
    getMatches: builder.query<any, any>({
      query: (filter: any = {}) => ({
        url: "",
        method: "find",
        params: filter,
      }),
    }),
  }),
});

export const { useGetMatchesQuery } = matchApi;
