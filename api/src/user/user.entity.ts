import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Role } from "authorization/role.enum";
import { Match } from "match/match.entity";
import { FilterPlugin } from "filter/filter.plugin";

@Schema()
export class User extends Document {
  @Prop({ unique: true, sparse: true }) // Nuevo campo: googleId, es opcional y único
  googleId?: string;

  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  friends: Types.ObjectId[];

  @Prop()
  resetKey?: string;

  @Prop()
  resetKeyTimeStamp?: string;

  @Prop()
  pushToken?: string;

  @Prop({
    type: [String],
    enum: Role,
    default: [Role.User],
  })
  roles: Role[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Match" }] })
  matches: Types.ObjectId[] | Match[]; // Array of ObjectIds referencing Match
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(FilterPlugin);


