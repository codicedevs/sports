import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FilterPlugin } from "filter/filter.plugin";
import { Location } from "locations/location.entity";
import mongoose, { Document, Types } from "mongoose";
import { SportMode } from "sport_modes/entities/sport_mode.entity";

@Schema()
export class Match extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: Number })
  dayOfWeek: number; // Almacenamos el día de la semana (0=Domingo, 1=Lunes, etc.)

  @Prop({ required: Number })
  hour: number; // Almacenamos la hora del día (0 a 23)

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  })
  location: Types.ObjectId | Location;

  @Prop({ required: true })
  playersLimit: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId; // Reference to the user who owns this partido

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  users: Types.ObjectId[]; // Array users reference

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "SportMode" } )
  sportMode: Types.ObjectId|SportMode;

}


export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.plugin(FilterPlugin);
MatchSchema.index({ dayOfWeek: 1, hour: 1 }); 
MatchSchema.index({ location: '2dsphere' });

