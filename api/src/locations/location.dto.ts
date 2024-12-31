import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateLocationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsArray()
  coordinates: [number, number]; // GeoJSON format [longitude, latitude]
}

export class LocationDto extends CreateLocationDto {
  @IsArray()
  matches?: Types.ObjectId[];
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  address?: string;

  @IsNotEmpty()
  @IsArray()
  coordinates?: [number, number];

  @IsOptional()
  @IsArray()
  matches?: Types.ObjectId[];
}
