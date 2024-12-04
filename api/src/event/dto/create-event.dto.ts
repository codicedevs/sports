import { Types } from "mongoose";

export class CreateEventDto {
    name: string;
    matches: Types.ObjectId[];
}
