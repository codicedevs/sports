import { CrudService } from "./crud";

class AuthService extends CrudService {
  constructor() {
    super("auth");
  }

  async login() {
    const res = await this.post("/signin", {
      email: "orefici.diego@gmail.com",
      password: "12345678",
    });
    this.saveAccessToken(res.data.access_token);
    return res;
  }
}

export const authService = new AuthService();
