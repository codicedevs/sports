import { SportMode } from "../types/interfaces";
import { CrudService } from "./crud";

class SportModeService extends CrudService<SportMode> {
  constructor() {
    super("sport-modes");
  }
}

export const sportModeService = new SportModeService();
