import { Match } from "./matches.type";

export interface GeoLocation {
  type: string;
  coordinates: [number, number];
}

export interface Location {
  location: GeoLocation;
  _id: string;
  name: string;
  address: string;
  __v: number;
  matches: Match[]; // Nota: esto crea una relación circular con Match.
}

export interface NewLocationDto {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}
