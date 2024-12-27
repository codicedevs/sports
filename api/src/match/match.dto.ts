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
import { ObjectId } from "mongodb";
import { SportMode } from "sport_modes/entities/sport_mode.entity";
import { Formations } from "./match.entity";

export class CreateMatchDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  location: ObjectId | Location;

  @IsNotEmpty()
  @IsNumber()
  playersLimit: number;

  @IsNotEmpty()
  @IsString()
  userId: ObjectId;

  @IsOptional()
  @IsArray() // Esto asegura que cada elemento en el array es un UserDto
  users?: ObjectId[];

  @IsOptional() // Esto hace que los usuarios invitados sean opcionales
  @IsArray()
  invitedUsers?: string[];

  @IsOptional()
  sportMode?: ObjectId|SportMode;

  @IsOptional()
  open?: boolean;

  @IsOptional()
  formations?: Formations;
}

export class MatchDto extends CreateMatchDto {
  dayOfWeek: number;
  hour: number;
}

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name?: string;

  @IsNotEmpty()
  @IsString()
  date?: string;

  @IsNotEmpty()
  @IsString()
  location?: ObjectId;

  @IsNotEmpty()
  @IsNumber()
  playersLimit?: number;

  @IsOptional()
  @IsArray()
  users?: ObjectId[];

  @IsOptional()
  sportMode?: ObjectId|SportMode;

  @IsOptional()
  open?: boolean;

  @IsOptional()
  formations?: Formations;
}
