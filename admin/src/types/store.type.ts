import { AxiosResponse } from "axios";

export interface ServiceMethods<ResponseType> {
  [key: string]: (
    data?: unknown,
    params?: unknown
  ) => Promise<AxiosResponse<ResponseType>>;
}

export interface GetArgs {
  id: string;
  populate?: string;
}

export type Filter = Record<string, any>;
