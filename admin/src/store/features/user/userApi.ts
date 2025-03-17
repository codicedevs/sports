import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { userService } from "../../../services/user";
import { User } from "../../../interfaces/interfaces";

interface UserResponse {
  results: User[];
  totalCount: number;
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

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery<UserResponse>(userService),
  endpoints: (builder) => ({
    getUsers: builder.query<any, any>({
      query: (filter: any) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
    }),
    getUser: builder.query<User, any>({
      query: ({ id, populate }) => ({
        url: ``,
        method: "find",
        params: { "where[_id][id]": id, ...(populate ? { populate } : {}) },
      }),
      transformResponse: (response: UserResponse) => response.results[0],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = userApi;
