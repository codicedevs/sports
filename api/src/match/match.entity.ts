import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FilterPlugin } from "filter/filter.plugin";
import mongoose, { Document, Types } from "mongoose";

@Schema()
export class Match extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  })
  location: Types.ObjectId;

  @Prop({ required: true })
  playersLimit: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId; // Reference to the user who owns this partido

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  users: Types.ObjectId[]; // Array users reference
}


export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.plugin(FilterPlugin);

