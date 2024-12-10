import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, Length } from 'class-validator';

@Schema()
export class Sport extends Document {
  @Prop({ required: true, unique: true })
  @IsString()
  name: string;
}

export const SportSchema = SchemaFactory.createForClass(Sport);
