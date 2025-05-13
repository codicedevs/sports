import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ChatroomKind } from "chatroom/chatroom.enum";
import { Message } from "messages/message.entity";
import mongoose, { Types, Document } from "mongoose";

  
  @Schema()
  export class Chatroom extends Document {
    @Prop({ type: String, enum: ChatroomKind, required: true })
    kind: ChatroomKind;
  
    // Para Match / Group
    @Prop({ type: mongoose.Schema.Types.ObjectId, refPath: "kind" })
    foreignId?: Types.ObjectId;
  
    // Para chat directo
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    participants?: Types.ObjectId[];
  
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Message }] })
    messages: Types.ObjectId[];
  }
  
export const ChatroomSchema = SchemaFactory.createForClass(Chatroom)