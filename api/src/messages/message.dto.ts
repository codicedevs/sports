import { PartialType } from "@nestjs/swagger"
import { Chatroom } from "chatroom/chatroom.entity"
import { Types } from "mongoose"
import { User } from "user/user.entity"
import { MessageKind } from "./message.enum"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    chatroomId: string;
    @IsNotEmpty()
    senderId: Types.ObjectId;
    @IsString()
    @IsNotEmpty()
    message: string;
    kind?: MessageKind = MessageKind.text;;
    foreignId?: Types.ObjectId;
}
export class SendMessageDto {
    @IsString()
    @IsNotEmpty()
    message: string;
    kind: MessageKind = MessageKind.text;
    foreignId?: Types.ObjectId;
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) { }