import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { IsString, IsMongoId } from 'class-validator';
import { Match } from 'match/match.entity';
import { User } from 'user/user.entity';

@Schema({_id: false})
export class RatingScores {
    @Prop()
    playerQuality: number
    @Prop()
    humaneQuality: number
    @Prop()
    puntuality: number
}
export const RRSchema = SchemaFactory.createForClass(RatingScores);
@Schema()
export class PlayerReview extends Document {
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    @IsMongoId()
    reviewer: Types.ObjectId | User

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    @IsMongoId()
    reviewee: Types.ObjectId | User

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Match' }) 
    match: Types.ObjectId | Match

    @Prop({ required: false })
    @IsString()
    scores?: RatingScores;
}

export const RatingSchema = SchemaFactory.createForClass(PlayerReview)