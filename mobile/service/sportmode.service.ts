import { SportMode } from "../types/form.type";
// import { CreatePetitionDto } from "../types/petition.type";
import { CRUDService } from "./CRUD";
// import { HttpService } from "./http.service";

class SportModeService extends CRUDService<SportMode> {
  constructor() {
    super("sport-modes");
  }

  // getAll = async () => {
  //   const res = await this.get(`/`);
  //   return res;
  // };

  // getById = async (id: string) => {
  //   const res = await this.get(`/${id}`);
  //   return res
  // }

  getModesBySportId = async (id:string) => {
    return await this.get(`/sport/${id}`)
  }
}

export default new SportModeService();