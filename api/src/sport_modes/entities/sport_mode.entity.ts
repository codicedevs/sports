import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsString, IsMongoId } from 'class-validator';
import { Sport } from 'sports/entities/sport.entity';

@Schema()
export class SportMode extends Document {
  @Prop({ required: true })
  @IsString()
  name: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Sport' }) // Relación con Sport
  @IsMongoId()
  sport: Types.ObjectId | Sport;
}

export const SportModeSchema = SchemaFactory.createForClass(SportMode);
