import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FilterPlugin } from "filter/filter.plugin";
import { Location } from "locations/location.entity";
import mongoose, { Document, Types } from "mongoose";
import { SportMode } from "sport_modes/sport_mode.entity";
import { User } from "user/user.entity";

// Sub-subschema: Player
@Schema({ _id: false })
export class Player {
  @Prop({ required: true })
  position: number; // Número de la posición en la formación

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId | User; // Referencia al User
}

export const PlayerSchema = SchemaFactory.createForClass(Player);


// Subschema: Formations
@Schema({ _id: false })
export class Formations {
  @Prop({ type: [PlayerSchema], required: true, default: [] })
  team1: Player[]; // Formación del equipo 1

  @Prop({ type: [PlayerSchema], required: true, default: [] })
  team2: Player[]; // Formación del equipo 2
}
export const FormationsSchema = SchemaFactory.createForClass(Formations);

@Schema()
export class Match extends Document {
  @Prop()
  name?: string;

  @Prop()
  date?: Date;

  @Prop()
  dayOfWeek?: number; // Almacenamos el día de la semana (0=Domingo, 1=Lunes, etc.)

  @Prop()
  hour?: number; // Almacenamos la hora del día (0 a 23)

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
  })
  location?: Types.ObjectId | Location;

  @Prop()
  playersLimit?: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId; // Reference to the user who owns this partido

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  users?: Types.ObjectId[]; // Array users reference

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "SportMode", required: true })
  sportMode: Types.ObjectId | SportMode;

  @Prop({ required: true, default: true })
  open: boolean

  @Prop({ type: FormationsSchema, required: false })
  formations?: Formations

}


export const MatchSchema = SchemaFactory.createForClass(Match);
MatchSchema.plugin(FilterPlugin);
MatchSchema.index({ dayOfWeek: 1, hour: 1 });
