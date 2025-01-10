import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ChatroomModelType } from "chatroom/chatroom.enum";
import { Message } from "messages/entities/message.entity";
import mongoose, { Types, Document } from "mongoose";

@Schema({ _id: false })
export class Reference {
    @Prop({
        type: String,
        enum: ChatroomModelType, // Usa el enum aquí
        required: true,
    })
    type: ChatroomModelType;

    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, refPath: "reference.type" })
    id: Types.ObjectId;
}
export const ReferenceSchema = SchemaFactory.createForClass(Reference)
@Schema()
export class Chatroom extends Document {
    @Prop({ type: ReferenceSchema })
    reference: Reference
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Message }] })
    messages: Types.ObjectId[] | Message[]
}
export const ChatroomSchema = SchemaFactory.createForClass(Chatroom)