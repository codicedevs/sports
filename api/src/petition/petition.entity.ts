import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { PetitionModelType, PetitionStatus } from "./petition.enum";
import { User } from "user/user.entity";
import { Match } from "match/match.entity";
import { Group } from "groups/group.entity";
@Schema({ _id: false })
export class Reference {
  @Prop({
    type: String,
    enum: PetitionModelType, // Usa el enum aquí
    required: true,
  })
  type: PetitionModelType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, refPath: "reference.type" })
  id?: Types.ObjectId | Match | User | Group;
}
export const referenceSchema = SchemaFactory.createForClass(Reference)
@Schema()
export class Petition extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  emitter: Types.ObjectId | User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  receiver: Types.ObjectId | User;

  @Prop({ type: referenceSchema })
  reference: Reference;

  @Prop({
    type: String,
    enum: PetitionStatus,
    default: PetitionStatus.Pending,
  })
  status: PetitionStatus;

  @Prop({ type: Boolean, required: true})
  isInvitation: boolean

  @Prop({type: String})
  text?: string
}

export const PetitionSchema = SchemaFactory.createForClass(Petition);
