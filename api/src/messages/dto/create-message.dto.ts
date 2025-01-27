import { Chatroom } from "chatroom/entities/chatroom.entity"
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
