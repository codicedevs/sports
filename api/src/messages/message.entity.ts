import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Chatroom } from "chatroom/chatroom.entity";
import { FilterPlugin } from "filter/filter.plugin";
import mongoose, { Types, Document } from "mongoose";
import { User } from "user/user.entity";

@Schema({ timestamps: true }) // createdAt, updatedAt
export class Message extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Chatroom })
    chatroomId: Types.ObjectId | Chatroom;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    senderId: Types.ObjectId | User;

    @Prop()
    message: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.plugin(FilterPlugin);