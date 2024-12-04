import { IsNotEmpty, IsEnum, IsMongoId } from "class-validator";
import { PetitionStatus } from "petition/petition.enum";
import { Types } from "mongoose";
import { PartialType } from "@nestjs/mapped-types";

export class CreatePetitionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly emitter: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly receiver: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  readonly match: Types.ObjectId;

  @IsEnum(PetitionStatus)
  readonly status: PetitionStatus = PetitionStatus.Pending;
}

export class UpdatePetitionDto extends PartialType(CreatePetitionDto) {
}
