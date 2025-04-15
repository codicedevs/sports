

export interface GeoLocation {
  type: string;
  coordinates: [number, number];
}

export interface Zone {
  location: GeoLocation;
  _id: string;
  name: string;
  coordinates: number[];
 
}

export interface NewZoneDto {
  name: string;
  location: string;
  coordinates: number[];
}
