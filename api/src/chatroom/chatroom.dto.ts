import { PartialType } from "@nestjs/swagger";
import { Reference } from "chatroom/chatroom.entity";
import { Message } from "messages/message.entity";
import { Types } from "mongoose";

export class CreateChatroomDto {
    reference: Reference
}

export class UpdateChatroomDto extends PartialType(CreateChatroomDto) {}
