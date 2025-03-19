import { PartialType } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreateEventDto {
    name: string;
    matches: Types.ObjectId[];
    
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
