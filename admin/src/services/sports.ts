import { Sport } from "../types/sport.type";
import { CrudService } from "./crud";

class SportService extends CrudService<Sport> {
  constructor() {
    super("sports");
  }
}

export const sportService = new SportService();
