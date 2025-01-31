import { PartialType } from "@nestjs/swagger"
import { Chatroom } from "chatroom/chatroom.entity"
import { Types } from "mongoose"
import { User } from "user/user.entity"

export class CreateMessageDto {
    chatroomId: string
    senderId: string
    message: string
}
export class SendMessageDto {
    senderId: string
    message: string
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}