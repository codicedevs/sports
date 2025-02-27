import { SportMode } from "../types/form.type";
// import { CreatePetitionDto } from "../types/petition.type";
import { CRUDService } from "./CRUD";
// import { HttpService } from "./http.service";

class SportModeService extends CRUDService<SportMode> {
  constructor() {
    super("sport-modes");
  }
}

export default new SportModeService();