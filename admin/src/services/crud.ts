import { API_URL } from "../config";
import { HttpBase } from "./http";

export class CrudService extends HttpBase {
  constructor(baseURL: string) {
    super(`${API_URL}/${baseURL}`);
  }

  getAccessToken(): any {
    return localStorage.getItem("jwt");
  }

  saveAccessToken(accessToken: string | null): any {
    return 1;
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
