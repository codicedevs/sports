import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema()
export class Location extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: {
      type: String, // GeoJSON object type, must be "Point" for single location.
      enum: ["Point"], // Valor fijo "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // Array de números [longitud, latitud]
      required: true,
    },
  })
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitud, latitud]
  };

  @Prop({ required: true })
  address: string;

  @Prop({ type: [{  type: mongoose.Schema.Types.ObjectId, ref: "Match" }] })
  matches: Types.ObjectId[]; // Array of references to Match documents
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ location: "2dsphere" });
