
import { CreateMatchDto } from "../types/match.type";
import { HttpService } from "./http.service";

class MatchService extends HttpService {
  constructor() {
    super("matches");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };

  create = async (match: CreateMatchDto) => {
    console.log(match)
    const res = await this.post(`/`, match);
    return res.data;
  };

  acceptCreatematch = async (matchId: string) => {
    return this.put(`/accept/${matchId}`);
  };

  declineCreatematch = async (matchId: string) => {
    return this.put(`/decline/${matchId}`);
  };

  getExistingMatch = async (emitterId: string, matchId: string) => {
    const res = await this.get(`/existing/${emitterId}/${matchId}`);
    return res.data;
  };
}

export default new MatchService();