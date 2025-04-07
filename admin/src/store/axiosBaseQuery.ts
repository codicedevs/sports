import { AxiosError, AxiosResponse } from "axios";
import { BaseQueryFn } from "@reduxjs/toolkit/query";

export const axiosBaseQuery =
  <ResponseType, RequestData = unknown, RequestParams = unknown>(
    service: Record<
      string,
      (
        data?: RequestData,
        params?: RequestParams
      ) => Promise<AxiosResponse<ResponseType>>
    >
  ): BaseQueryFn<
    {
      url: string;
      method: keyof typeof service;
      data?: RequestData;
      params?: RequestParams;
    },
    ResponseType,
    unknown
  > =>
  async ({ method, data, params }) => {
    try {
      const result: AxiosResponse<ResponseType> = await service[method](
        data,
        params
      );
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
