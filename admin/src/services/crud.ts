import { API_URL } from "../config";
import objectToQueryString from "../utils/queryToString";
import { HttpBase } from "./http";

export class CrudService extends HttpBase {
  constructor(baseURL: string) {
    super(`${API_URL}/${baseURL}`);
  }

  async find(data: any, filter: any): Promise<any> {
    console.log("ddddd", filter);
    const params = objectToQueryString(filter);
    console.log("asd", params);
    return this.get(`?${params}`);
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
