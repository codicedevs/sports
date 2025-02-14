import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { PetitionModelType, PetitionStatus } from "./petition.enum";
import { User } from "user/user.entity";
import { FilterPlugin } from "filter/filter.plugin";
@Schema({ _id: false })
export class Reference {
  @Prop({
    type: String,
    enum: PetitionModelType, // Usa el enum aquí
    required: true,
  })
  type: PetitionModelType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, refPath: "reference.type" })
  id: Types.ObjectId;
}
export const referenceSchema = SchemaFactory.createForClass(Reference)
@Schema()
export class Petition extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  emitter: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  receiver: Types.ObjectId;

  @Prop({ type: referenceSchema })
  reference: Reference;


  @Prop({
    type: String,
    enum: PetitionStatus,
    default: PetitionStatus.Pending,
  })
  status: PetitionStatus;
}

export const PetitionSchema = SchemaFactory.createForClass(Petition);
