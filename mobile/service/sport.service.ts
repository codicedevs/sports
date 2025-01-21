import { HttpService } from "./http.service";


 class SportsService extends HttpService {
    constructor() {
        super("sports");
    }

    getSports = async () => {
       return await this.get("")
    }
}

export default new SportsService();
