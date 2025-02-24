import { Sport } from "../types/form.type";
import { CRUDService } from "./CRUD";
// import { HttpService } from "./http.service";


 class SportsService extends CRUDService<Sport> {
    constructor() {
        super("sports");
    }

    // getAll = async () => {
    //    return await this.get("")
    // }
}

export default new SportsService();
