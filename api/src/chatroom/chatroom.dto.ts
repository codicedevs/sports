import { PartialType } from "@nestjs/swagger";
import { Message } from "messages/message.entity";
import { Types } from "mongoose";
import { ChatroomKind } from "./chatroom.enum";

export class CreateChatroomDto {
    kind: ChatroomKind;
    foreignId?: Types.ObjectId;
    participants?: Types.ObjectId[];
}

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {}
