
import Match, { CreateMatchDto } from "../types/match.type";
import { CRUDService } from "./CRUD";

class MatchService extends CRUDService<Match> {
  constructor() {
    super("matches");
  }
  
  
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