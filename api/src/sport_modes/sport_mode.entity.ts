import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { IsString, IsMongoId } from 'class-validator';
import { Sport } from 'sports/sport.entity';

@Schema()
export class SportMode extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId , ref: 'Sport' }) // Relación con Sport
  @IsMongoId()
  sport: Types.ObjectId | Sport;

  @Prop({ required: false })
  @IsString()
  label?: string;
}

export const SportModeSchema = SchemaFactory.createForClass(SportMode);
