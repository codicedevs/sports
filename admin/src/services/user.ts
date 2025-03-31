import { User } from "../interfaces/interfaces";
import { CrudService } from "./crud";

class UserService extends CrudService<User> {
  constructor() {
    super("users");
  }
}

export const userService = new UserService();
