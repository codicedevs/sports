import { PartialType } from "@nestjs/mapped-types";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { Location } from "locations/location.entity";
import { SportMode } from "sport_modes/sport_mode.entity";
import { Formations } from "./match.entity";
import { Types } from "mongoose";

export class CreateMatchDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  name?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  location?: Types.ObjectId | Location;

  @IsOptional()
  @IsNumber()
  playersLimit?: number;

  @IsNotEmpty()
  @IsString()
  userId: Types.ObjectId;

  @IsOptional()
  @IsArray() // Esto asegura que cada elemento en el array es un UserDto
  users?: Types.ObjectId[];

  @IsOptional() // Esto hace que los usuarios invitados sean opcionales
  @IsArray()
  invitedUsers?: string[];

  sportMode: Types.ObjectId|SportMode;

  @IsOptional()
  open?: boolean;

  @IsOptional()
  formations?: Formations;

  @IsOptional()
  description?: string;
}

export class MatchDto extends CreateMatchDto {
  dayOfWeek?: number;
  hour?: number;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {}