import { CRUDService } from "./CRUD";
import { HttpService } from "./http.service";


 class ZonesService extends CRUDService<Zone> {
    constructor() {
        super("zones");
    }

    getZones = async () => {
       return await this.get("")
    }
}

export default new ZonesService();
