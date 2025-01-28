// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { matchService } from "../../../services/match";

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
  ): BaseQueryFn<{ url: string; method: string; data?: any }, T, unknown> =>
  async ({ method, data }) => {
    try {
      const result: AxiosResponse<T> = await service[method](data);
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
      query: () => ({
        url: "",
        method: "find",
      }),
    }),
  }),
});

export const { useGetMatchesQuery } = matchApi;
