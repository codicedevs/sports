import { User } from "../types/interfaces";
import { CrudService } from "./crud";

class UserService extends CrudService<User> {
  constructor() {
    super("users");
  }
}

export const userService = new UserService();
