import { PartialType } from "@nestjs/swagger";
import { Types } from "mongoose";
import { Sport } from "sports/sport.entity";

export class CreateSportModeDto {
    name: string;
    sport: Types.ObjectId | Sport;
    label?: string
}

export class UpdateSportModeDto extends PartialType(CreateSportModeDto) { }