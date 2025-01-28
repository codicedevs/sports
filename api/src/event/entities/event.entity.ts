import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Match } from 'match/match.entity';
import mongoose, { Document, Types } from 'mongoose';

@Schema()
export class Event extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Match.name, required: true })
    matches: Types.ObjectId[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
