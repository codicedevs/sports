import { SportMode } from "../types/sportModes.type";
import { CrudService } from "./crud";

class SportModeService extends CrudService<SportMode> {
  constructor() {
    super("sport-modes");
  }
}

export const sportModeService = new SportModeService();
