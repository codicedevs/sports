import { SportMode } from "../interfaces/interfaces";
import { CrudService } from "./crud";

class SportModeService extends CrudService<SportMode> {
  constructor() {
    super("sport-modes");
  }
}

export const sportModeService = new SportModeService();
