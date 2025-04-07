import { Match } from "../types/matches.type";
import { CrudService } from "./crud";

class MatchService extends CrudService<Match> {
  constructor() {
    super("matches");
  }
}

export const matchService = new MatchService();
