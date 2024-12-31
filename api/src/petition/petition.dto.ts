import { IsNotEmpty, IsEnum, IsMongoId } from "class-validator";
import { PetitionModelType, PetitionStatus } from "petition/petition.enum";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";
import { Reference } from "./petition.entity";

export class CreatePetitionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly emitter: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly receiver: Types.ObjectId;

  reference: Reference;

  @IsEnum(PetitionStatus)
  readonly status: PetitionStatus = PetitionStatus.Pending;

}

export class UpdatePetitionDto extends PartialType(CreatePetitionDto) {
}
