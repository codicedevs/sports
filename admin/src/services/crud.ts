import { API_URL } from "../config";
import { Filter } from "../types/filters.type";
import objectToQueryString from "../utils/string";
import { HttpBase } from "./http";

export class CrudService<T> extends HttpBase {
  constructor(baseURL: string) {
    super(`${API_URL}/${baseURL}`);
  }

  async create<D = T>(data: D) {
    try {
      const response = await this.post("/", data);
      return response;
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  async find(data: any, filter: Filter<T>): Promise<T> {
    return this.get("", { params: filter });
  }

  async findById(id: string, filter: Filter<T>): Promise<T> {
    const params = objectToQueryString(filter);
    return this.get(`/${id}?${params}`);
  }

  async findAll(filter: Filter<T>): Promise<T> {
    const params = objectToQueryString(filter);
    console.log("params", params);
    return this.get(`?${params}`);
  }

  async remove(id: string): Promise<T> {
    return this.delete(`/${id}`);
  }

  async update(id: string, data: T): Promise<T> {
    return this.put(`/${id}`, data);
  }

  getAccessToken(): string | null {
    return localStorage.getItem("jwt");
  }

  saveAccessToken(accessToken: string): void {
    localStorage.setItem("jwt", accessToken);
  }

  refreshAccessToken(): Promise<string | null> | string | null {
    return "1";
  }

  getRefreshToken(): Promise<string | null> | string | null {
    return "1";
  }

  saveRefreshToken(refreshToken: string | null): Promise<void> | void {
    // return 1;
  }
}
