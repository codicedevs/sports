import { User } from "../types/user.type";
import { HttpService } from "./http.service";
import Match, { CreateMatchDto } from "../types/match.type";

class MatchService extends HttpService {
  constructor() {
    super("matches");
  }

  getAll = async () => {
    const res = await this.get(`/`);
    return res.data;
  };

  getAllAvailable = async () =>{
    const res = await this.get("/available")
    return res.data;
  }

  findOne = async (id: string) => {
    const res = await this.get(`/${id}`);
    return res.data;
  };

  createMatch = async (body: CreateMatchDto) => {
    return this.post(`/`, body);
  };

  updateMatch = async (id: string, body: CreateMatchDto) => {
    return this.put(`/${id}`, body);
  };

  deleteMatch = async (id: string) => {
    return this.delete(`/${id}`);
  };

  removeUserFromMatch = async (matchId: string, userId: string) => {
    try {
      const response = await this.patch(`/${matchId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default new MatchService();
