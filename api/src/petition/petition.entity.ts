import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { PetitionStatus } from "./petition.enum";

@Schema()
export class Petition extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  emitter: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  receiver: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Match" })
  match: Types.ObjectId;

  @Prop({
    type: String,
    enum: PetitionStatus,
    default: PetitionStatus.Pending,
  })
  status: PetitionStatus;
}

export const PetitionSchema = SchemaFactory.createForClass(Petition);
