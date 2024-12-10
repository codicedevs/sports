import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  // @IsNumber({}, { each: true })
  // @IsArray()
  coordinates: number[]; // Un array de dos números [lng, lat]
}

class RingDto {
  // @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  // @IsArray()
  ring: CoordinateDto[]; // Un array de coordenadas
}

class LocationDto {
  // @IsString()
  // @IsNotEmpty()
  type: string; // Siempre será "Polygon"

  // @ValidateNested({ each: true })
  @Type(() => RingDto)
  // @IsArray()
  coordinates: RingDto[]; // Array de anillos
}

export class CreateZoneDto {
  // @IsString()
  // @IsNotEmpty()
  name: string; // Nombre de la zona

  // @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto; // Objeto para representar la ubicación (GeoJSON)
}
