import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsArray, IsMongoId, IsString } from "class-validator";
import mongoose, {  Document, Types } from "mongoose";
import { Sport } from "sports/sport.entity";

@Schema()
export class Question extends Document {
  @Prop({ required: true })
  @IsString()
  question: string;

  @Prop({ required: true })
  @IsString()
  answer: string;

  @Prop({ required: true })
  @IsArray()
  options: string[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
