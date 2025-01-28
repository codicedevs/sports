import { Reference } from "chatroom/entities/chatroom.entity";
import { Message } from "messages/entities/message.entity";
import { Types } from "mongoose";

export class CreateChatroomDto {
    reference: Reference
}
