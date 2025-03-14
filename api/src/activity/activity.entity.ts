import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { IsString, Length } from 'class-validator';
import { Match } from 'match/match.entity';

@Schema()
export class Activity extends Document {
  @Prop({ required: true })
  date: Date;
  @Prop({ required: true})
  @IsString()
  description: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Match", required: true })
  matchId: Types.ObjectId | Match
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.index({ matchId: 1, date: 1 });
