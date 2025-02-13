import { MatchDto } from "match/match.dto";
import { Match } from "match/match.entity";
import { HydratedDocument } from "mongoose";

export class MatchUpdatedEvent {
    constructor(public match: HydratedDocument<Match>) {}
  }
  