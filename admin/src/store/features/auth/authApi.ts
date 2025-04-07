// src/features/auth/authApi.ts
import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { authService } from "../../../services/auth";

interface LoginResponse {
  user: { id: string; name: string };
  access_token: string;
  refresh_token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

// interface ApiResponse<T> {
//   data: T;
// }

const axiosBaseQuery =
  <T>(
    service: any
  ): BaseQueryFn<{ url: string; method: string; data?: unknown }, T, unknown> =>
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

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery<LoginResponse>(authService),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "",
        method: "login",
        data: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
