import { CreatePetitionDto } from "../types/petition.type";
import { HttpService } from "./http.service";

class SportModeService extends HttpService {
  constructor() {
    super("sport-modes");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res;
  };

  getById = async (id: string) => {
    const res = await this.get(`/${id}`);
    return res
  }
}

export default new SportModeService();