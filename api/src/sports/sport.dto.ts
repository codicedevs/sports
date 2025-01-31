import { PartialType } from "@nestjs/swagger";

export class CreateSportDto {
    name: string;
}

export class UpdateSportDto extends PartialType(CreateSportDto) { }