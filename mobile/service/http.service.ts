import { HttpBase } from "@codice-arg/http-service/dist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../utils/config";

export class HttpService extends HttpBase {
  constructor(recurso = "") {
    super(`${BASE_URL}/${recurso}`);
    this.setupInterceptors();
  }

  getAccessToken(): string | Promise<string | null> {
    return AsyncStorage.getItem("access");
  }

  protected getRefreshToken(): string | Promise<string | null> {
    return AsyncStorage.getItem("refresh");
  }

  saveRefreshToken(refreshToken: string | null): void | Promise<void> {
    return AsyncStorage.setItem("refresh", refreshToken ?? "");
  }

  saveAccessToken(accessToken: string | null): void | Promise<void> {
    return AsyncStorage.setItem("access", accessToken ?? "");
  }

  async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();
      console.log("[HttpService] Refreshing token...");

      const resp = await axios.post<{ accessToken: string }>(
        `${BASE_URL}/auth/refresh-token`,
        undefined,
        { headers: { "refresh-token": refreshToken } }
      );

      console.log(
        "[HttpService] Refresh Token Response:",
        resp.status,
        resp.data
      );
      return resp.data.accessToken;
    } catch (err) {
      console.error("[HttpService] Refresh Token Error:", err);
      return null;
    }
  }

  setupInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        console.log("[HttpService] Request:", {
          method: config.method,
          url: config.url,
          params: config.params,
          data: config.data,
        });
        return config;
      },
      (error) => {
        console.error("[HttpService] Request Error:", error);
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        console.log("[HttpService] Response:", {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        if (error.response) {
          console.error("[HttpService] Error Response:", {
            status: error.response.status,
            url: error.response.config.url,
            data: error.response.data,
          });
        } else {
          console.error("[HttpService] Network Error:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }
}
