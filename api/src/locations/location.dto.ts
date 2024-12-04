import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ObjectId } from "mongodb";

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
  matches?: ObjectId[];
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
  matches?: ObjectId[];
}
