import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "@sentry/nestjs";
import { IsArray, IsMongoId, IsString } from "class-validator";
import { Match } from "match/match.entity";
import mongoose, { Document, Types } from "mongoose";
import { Question } from "question/question.entity";
import { Sport } from "sports/sport.entity";

@Schema()
export class Quiz extends Document {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Match' }) // Relación con Sport
    @IsMongoId()
    matchId: Types.ObjectId | Match;

    @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'User' }) // Relación con Sport
    @IsMongoId()
    player1: Types.ObjectId | User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }) // Relación con Sport
    @IsMongoId()
    player2: Types.ObjectId | User;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: () => Question }] })
    questions: Types.ObjectId[] | Question[]

    @Prop({type: Number, default: 0})
    scorePlayer1: number

    @Prop({type: Number, default: 0})
    scorePlayer2: number

    @Prop({type: Number, default: 0})
    currentQuestion: number

    @Prop({type: [Number],enum:[-1,0,1], default:[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]})
    scorePlayer1History: number[]

    @Prop({type: [Number],enum:[-1,0,1], default:[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]})
    scorePlayer2History: number[]

    @Prop({ type: Number, enum: [0, 1, 2], default: 0 })
    winner: 0 | 1 | 2;

}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
