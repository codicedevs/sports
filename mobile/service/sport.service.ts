import { Sport } from "../types/form.type";
import { CRUDService } from "./CRUD";
// import { HttpService } from "./http.service";


 class SportsService extends CRUDService<Sport> {
    constructor() {
        super("sports");
    }
}

export default new SportsService();
