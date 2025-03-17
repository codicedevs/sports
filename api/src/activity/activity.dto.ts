import { PartialType } from "@nestjs/swagger";
import { Match } from "match/match.entity";
import { Types } from "mongoose";

export class CreateActivityDto {
    matchId: Types.ObjectId | Match;
    description: string;
}

export class UpdateActivityDto extends PartialType(CreateActivityDto) { }