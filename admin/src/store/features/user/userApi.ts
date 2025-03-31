import { BaseQueryFn, createApi } from "@reduxjs/toolkit/query/react";
import { AxiosError, AxiosResponse } from "axios";
import { userService } from "../../../services/user";
import { NewUserDto, User } from "../../../interfaces/interfaces";

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
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, any | void>({
      query: (filter?: any) => {
        console.log("elfio", filter);
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, any>({
      query: ({ id, populate }) => {
        console.log("getUser:", { id, populate });
        return {
          url: ``,
          method: "findById",
          data: id,
          params: populate ? { populate } : {},
        };
      },
      // transformResponse: (response: UserResponse) => {
      //   console.log("response", response);
      //   return response.results[0];
      // },
    }),
    registerUser: builder.mutation<NewUserDto, User>({
      query: (newUser: NewUserDto) => ({
        url: "",
        method: "create",
        data: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<any, { userId: string; user: User }>({
      query: ({ userId, user }) => ({
        url: "",
        method: "update",
        data: userId,
        params: user,
      }),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<string, string>({
      query: (userId: string) => ({
        url: "",
        method: "remove",
        data: userId,
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUsers", undefined, (draft) => {
            draft.results = draft.results.filter(
              (user: User) => user._id !== userId
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
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useRegisterUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;
