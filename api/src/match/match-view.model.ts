import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Location } from 'locations/location.entity';
import { User } from 'user/user.entity';
import { SportMode, SportModeSchema } from 'sport_modes/sport_mode.entity';
import { Formations, FormationsSchema } from './match.entity';

@Schema({ collection: 'matchView', versionKey: false })
export class MatchView extends Document {
  @Prop()
  name?: string;

  @Prop()
  date?: Date;

  @Prop()
  dayOfWeek?: number;

  @Prop()
  hour?: number;

  // The following fields come from the $lookup stages in your view pipeline.
  @Prop({ type: User })
  user?: User; // You can replace "any" with a more specific type/interface if desired

  @Prop({ type: Location })
  location?: Location;

  @Prop({ type: SportModeSchema, required: true })
  sportMode: SportMode;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] })
  users?: Types.ObjectId[]; // Array users reference

  @Prop()
  open?: boolean

  @Prop()
  playersLimit?: number;

  @Prop({ type: FormationsSchema, required: false })
  formations?: Formations
}

export const MatchViewSchema = SchemaFactory.createForClass(MatchView);

