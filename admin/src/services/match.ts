import { Match } from "../interfaces/interfaces";
import { CrudService } from "./crud";

class MatchService extends CrudService<Match> {
  constructor() {
    super("matches");
  }
}

export const matchService = new MatchService();
