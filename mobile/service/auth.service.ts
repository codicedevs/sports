import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { HttpService } from "./http.service";

interface LoginProps {
  access_token: string;
  refreshToken: string;
  user: any;
}

export class AuthService extends HttpService {
  constructor() {
    super("auth");
  }

  async login(email: string, password: string) {
    console.log(email);
    console.log(password);
    let loginProps: LoginProps | null = null;

    const res = await axios.post<LoginProps>(`${BASE_URL}/auth/signin`, {
      email: email,
      password: password,
    });
    this.saveAccessToken(res.data.access_token);
    this.saveRefreshToken(res.data.refreshToken);
    loginProps = res.data;

    return loginProps;
  }

  async signOut() {
    try {
      // Obtener el refresh token del almacenamiento local
      const refreshToken = await AsyncStorage.getItem("refresh");
      // Enviar el refresh token al backend para invalidarlo
      if (refreshToken) {
        const response = await axios.post(`${BASE_URL}/auth/logout`, {
          refreshToken,
        });
      }

      // Limpiar el almacenamiento local de tokens
      await AsyncStorage.removeItem("access");
      await AsyncStorage.removeItem("refresh");
      //console.log("Sesión cerrada exitosamente");
    } catch (error) {
      //console.error("Error al cerrar sesión:", error);
    } finally {
      // Asegurarse de que los tokens se eliminen incluso si ocurre un error
      await AsyncStorage.removeItem("access");
      await AsyncStorage.removeItem("refresh");
    }
  }

  async whoami() {
    return this.get("whoami");
  }
}

export default new AuthService();
