
import Match, { CreateMatchDto } from "../types/match.type";
import { CRUDService } from "./CRUD";

class MatchService extends CRUDService<Match> {
  constructor() {
    super("matches");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };


  update = async (id: string, matchInfo: CreateMatchDto) => {
    const res = await this.put(`/${id}`, matchInfo)
    return res.data
  }

  getById = async (id: string) => {
    return await this.get(`/${id}`)
  }

  create = async (match: CreateMatchDto) => {
    const res = await this.post(`/`, match);
    return res
  };

  addPlayerToFormation = async (
    matchId: string,
    userId: string,
    body: { team: number; position: number }
  ) => {
    await this.patch(`/${matchId}/formation/${userId}/add`, body)
  }

  removePlayerFromFormation = async (
    matchId: string,
    userId: string
  ) => {
    await this.patch(`/${matchId}/formation/${userId}/add`)
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