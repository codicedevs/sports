import { Types } from "mongoose";
import { Sport } from "sports/entities/sport.entity";

export class CreateSportModeDto {
    name: string;
    sport: Types.ObjectId|Sport;
}
