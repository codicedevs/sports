import { CrudService } from "./crud";

class MatchService extends CrudService {
  constructor() {
    super("matches");
  }
}

export const matchService = new MatchService();
