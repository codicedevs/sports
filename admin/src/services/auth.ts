import { User } from "../interfaces/interfaces";
import { CrudService } from "./crud";
interface loginData {
  email: string;
  password: string;
}

class AuthService extends CrudService<User> {
  constructor() {
    super("auth");
  }

  async login(data: loginData) {
    const res = await this.post("/signin", {
      email: data.email,
      password: data.password,
    });
    this.saveAccessToken(res.data.access_token);
    return res;
  }

  logout() {
    this.removeAccessToken();
  }

  removeAccessToken() {
    localStorage.removeItem("jwt");
  }
}

export const authService = new AuthService();
