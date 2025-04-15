import { IsString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';


class ZoneLocationDto {
  @IsIn(["Polygon"])
  type?: "Polygon";

  @IsArray()
  coordinates?: [number, number][][];
}
export class CreateZoneDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => ZoneLocationDto)
  location?: ZoneLocationDto;
}


export class UpdateZoneDto extends PartialType(CreateZoneDto) { }