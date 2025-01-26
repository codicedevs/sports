import { IsArray, IsOptional } from "class-validator";
import { ObjectId, Types } from "mongoose";
import { User } from "user/user.entity";

export class CreateGroupDto {
    name: string;
    userId: Types.ObjectId
    users?: ObjectId | User[]
    playersLimit?: number
    @IsOptional() // Esto hace que los usuarios invitados sean opcionales
    @IsArray()
    invitedUsers?: string[];
}
