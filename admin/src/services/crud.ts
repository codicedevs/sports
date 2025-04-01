import { API_URL } from "../config";
import { Filter } from "../types/filters.type";
import { Match } from "../types/matches.type";
import objectToQueryString from "../utils/string";
import { HttpBase } from "./http";

export class CrudService<T> extends HttpBase {
  constructor(baseURL: string) {
    super(`${API_URL}/${baseURL}`);
  }

  async create(data: any) {
    try {
      const response = await this.post("/", data);
      return response;
    } catch (err) {
      console.log("ERROR", err);
    }
  }

  async find(data: any, filter: Filter<T>): Promise<Match> {
    return this.get("", { params: filter });
  }

  async findById(id: string, filter: Filter<T>): Promise<Match> {
    const params = objectToQueryString(filter);
    return this.get(`/${id}?${params}`);
  }

  async findAll(filter: Filter<T>): Promise<Match> {
    const params = objectToQueryString(filter);
    console.log("params", params);
    return this.get(`?${params}`);
  }

  async remove(id: string): Promise<any> {
    return this.delete(`/${id}`);
  }

  async update(id: string, data: T): Promise<any> {
    return this.put(`/${id}`, data);
  }

  getAccessToken(): any {
    return localStorage.getItem("jwt");
  }

  saveAccessToken(accessToken: string): any {
    localStorage.setItem("jwt", accessToken);
  }

  refreshAccessToken(): any {
    return 1;
  }

  getRefreshToken(): any {
    return 1;
  }

  saveRefreshToken(refreshToken: string | null): any {
    return 1;
  }
}
