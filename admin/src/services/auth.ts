import { CrudService } from "./crud";

class AuthService extends CrudService {
  constructor() {
    super("auth");
  }

  async login() {
    return this.post("/signin", {
      email: "orefici.diego@gmail.com",
      password: "12345678",
    });
  }
}

export const authService = new AuthService();
