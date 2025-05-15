import { PartialType } from "@nestjs/swagger"
import { Chatroom } from "chatroom/chatroom.entity"
import { Types } from "mongoose"
import { User } from "user/user.entity"
import { MessageKind } from "./message.enum"

export class CreateMessageDto {
    chatroomId: string;
    senderId: Types.ObjectId;
    message: string;
    kind?: MessageKind = MessageKind.text;;
    foreignId?: Types.ObjectId;
}
export class SendMessageDto {
    message: string;
    kind: MessageKind = MessageKind.text;
    foreignId?: Types.ObjectId;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}