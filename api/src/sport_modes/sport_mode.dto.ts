import { PartialType } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Sport } from "sports/sport.entity";

export class CreateSportModeDto {
    name: string;
    sport: Types.ObjectId | Sport;
}

export class UpdateSportModeDto extends PartialType(CreateSportModeDto) { }