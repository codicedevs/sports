import { CreatePetitionDto } from "../types/petition.type";
import { HttpService } from "./http.service";

class PetitionService extends HttpService {
  constructor() {
    super("petitions");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };

  create = async (petition: CreatePetitionDto) => {
    const res = await this.post(`/`, { petition });
    return res.data;
  };

  acceptPetition = async (petitionId: string) => {
    return this.put(`/accept/${petitionId}`);
  };

  declinePetition = async (petitionId: string) => {
    return this.put(`/decline/${petitionId}`);
  };

  getExistingPetition = async (emitterId: string, matchId: string) => {
    const res = await this.get(`/existing/${emitterId}/${matchId}`);
    return res.data;
  };
}

export default new PetitionService();