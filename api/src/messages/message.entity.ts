import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Chatroom } from "chatroom/chatroom.entity";
import { FilterPlugin } from "filter/filter.plugin";
import mongoose, { Types, Document } from "mongoose";
import { User } from "user/user.entity";
import { MessageKind } from "./message.enum";

@Schema({ timestamps: true }) // createdAt, updatedAt
export class Message extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => Chatroom })
    chatroomId: Types.ObjectId | Chatroom;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: () => User })
    senderId: Types.ObjectId | User;

    @Prop({required: true})
    message: string;

    @Prop({type: String, enum: MessageKind, default: MessageKind.text, required: true })
    kind: MessageKind;

    @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: "kind" })
    foreignId?: Types.ObjectId;

}
export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ chatroomId: 1, createdAt: -1 });