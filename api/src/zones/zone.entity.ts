import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema()
export class Zone extends Document {
  @Prop({ required: true })
  name: string; // Nombre de la zona (e.g., "Centro", "Sur")

  @Prop({
    type: {
      type: String,
      enum: ["Polygon"],
      required: true,
    },
    coordinates: {
      type: [[[Number]]], // Coordenadas del polígono (array de [lng, lat])
      required: true,
    },
  })
  location: {
    type: "Polygon";
    coordinates: number[][][]; // Array de coordenadas del polígono
  };
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
ZoneSchema.index({ location: "2dsphere" }); // Índice geoespacial para la consulta eficiente
