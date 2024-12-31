import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";
import { Role } from "authorization/role.enum";
import { Match } from "match/match.entity";
import { Zone } from "zones/entities/zone.entity";
import { Sport } from "sports/entities/sport.entity";
import { SportMode } from "sport_modes/entities/sport_mode.entity";
import { Group } from "groups/entities/group.entity";

// Subschema: Interval
@Schema({ _id: false })
class Interval {
  @Prop({ required: true, min: 0, max: 24 }) // Hora de inicio (0-24)
  startHour: number;

  @Prop({ required: true, min: 0, max: 24 }) // Hora de fin (0-24)
  endHour: number;
}

export const IntervalSchema = SchemaFactory.createForClass(Interval);

// Subschema: Availability
@Schema({ _id: false })
class Availability {
  @Prop({
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  })
  day: string;

  @Prop({ type: [IntervalSchema], required: true }) // Array de intervalos
  intervals: Interval[];
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
// Subschema: Profile
export class Profile {
  @Prop({ type: [AvailabilitySchema], required: true }) // Array de disponibilidades
  availability: Availability[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Zone" }],
  })
  preferredZones?: Types.ObjectId[] | Zone[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
  })
  preferredSports?: Types.ObjectId[] | Sport[];
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "SportMode" }],
  })
  preferredSportModes?: Types.ObjectId[] | SportMode[];

}
export const ProfileSchema = SchemaFactory.createForClass(Profile);

// Main schema: User
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
  matches: Types.ObjectId[] | Match[];

  @Prop({ type: ProfileSchema, required: false }) // El perfil es opcional
  profile?: Profile;

  @Prop({type:[{type: mongoose.Schema.Types.ObjectId, ref: "Group"}]})
  groups?: Types.ObjectId[] | Group[]; 

}

// Creación de esquemas


export const UserSchema = SchemaFactory.createForClass(User);
