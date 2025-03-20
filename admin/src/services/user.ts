import { User } from "../interfaces/interfaces";
import { CrudService } from "./crud";

class UserService extends CrudService<User> {
  constructor() {
    super("users");
  }

  async createUser(data: any) {
    console.log("servicio", data);
    try {
      const response = await this.post("/", data);
      return response;
    } catch (err) {
      console.log("ERROR", err);
    }
  }
}

export const userService = new UserService();
