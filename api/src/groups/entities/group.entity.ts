import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId, IsString } from "class-validator";
import { FilterPlugin } from "filter/filter.plugin";
import mongoose, { Document, ObjectId, Types } from "mongoose";
import { User } from "user/user.entity";


@Schema()
export class Group extends Document {
    @Prop({ required: true })
    @IsString()
    name: string;
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
    users: Types.ObjectId[]; // Array users reference
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
    userId: Types.ObjectId | User; // Array users reference
    @Prop({ default: 1000})
    playersLimit: number; // Array users reference
}

export const GroupSchema = SchemaFactory.createForClass(Group);
GroupSchema.plugin(FilterPlugin);