import { HttpService } from "./http.service";


 class ZonesService extends HttpService {
    constructor() {
        super("zones");
    }

    getZones = async () => {
       return await this.get("")
    }
}

export default new ZonesService();
