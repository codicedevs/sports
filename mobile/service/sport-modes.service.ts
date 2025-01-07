import { HttpService } from "./http.service";


 class SportModesService extends HttpService {
    constructor() {
        super("sport-modes");
    }

    getSportModes = async () => {
       return await this.get("")
    }
}

export default new SportModesService();
