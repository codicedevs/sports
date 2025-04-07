import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosResponse } from "axios";
import { userService } from "../../../services/users";
import { NewUserDto, User } from "../../../types/users.types";
import { axiosBaseQuery } from "../../axiosBaseQuery";
import { Filter, GetArgs } from "../../../types/store.type";

interface UserResponse {
  results: User[];
  totalCount: number;
}

export interface ServiceMethods<ResponseType> {
  [key: string]: (
    data?: unknown,
    params?: unknown
  ) => Promise<AxiosResponse<ResponseType>>;
}

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

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery<UserResponse>(
    userService as unknown as ServiceMethods<UserResponse>
  ),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserResponse, Filter | void>({
      query: (filter?: Filter) => {
        return {
          url: ``,
          method: "find",
          params: filter,
        };
      },
      providesTags: ["Users"],
    }),
    getUser: builder.query<User, GetArgs>({
      query: ({ id, populate }) => {
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
    registerUser: builder.mutation<User, NewUserDto>({
      query: (newUser: NewUserDto) => ({
        url: "",
        method: "create",
        data: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<User, { userId: string; user: User }>({
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
