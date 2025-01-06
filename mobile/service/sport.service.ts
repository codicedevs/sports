import { HttpService } from "./http.service";


export class SportsService extends HttpService {
    constructor() {
        super("sports");
    }

    getSports = () => {
       return this.get("")
    }
}

export default new SportsService();
